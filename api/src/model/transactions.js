
import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import uuid from "uuid/v1";
import util from "../helpers/utility";

class transactionsRepo {
  

  GetDashBoardInfo() {

  }

  getTransactionsByPersonId(transactionId,LastEvaluatedKey = null) {
    return new Promise((resolve, reject) => {
      let getParams = this.getParamsForDb(transactionId,LastEvaluatedKey);
      //resolve(getParams);
      dynamoClient.query(getParams, function (err, data) {
        if (err) {
          reject(err);
        } else {
          if(data.LastEvaluatedKey){
            getTransactionsByPersonId(transactionId,LastEvaluatedKey)
          }
          else{
            resolve(data);
          }
        }
      });
    });
  }

  async addTransaction(transaction) {     
    let addedTransaction = await this.addNewTransaction(transaction);
    return addedTransaction;
  } 

  
  async addNewTransaction(transaction) {       
    let trResponse = await this.insertTransaction(transaction);    
    if(trResponse && trResponse.status === "success"){      
      let infoExist = await this.dashboardInfoExist(trResponse.newTransaction);       
      if(infoExist && infoExist.Count == 0){
          let newDashBoardInfo = this.addDashboardInfo(trResponse.newTransaction);                 
          return newDashBoardInfo;
      }else{          
          let updatedInfo = await this.updateDashBoardInfo(trResponse.newTransaction);          
          return updatedInfo;      
      }
    } 
  }

  insertTransaction(transaction) {
    return new Promise((resolve, reject) => {            
      let newTransaction = this.putParamsForDb(transaction);        
      dynamoClient.put(newTransaction, function (err, data) {
        if (err) {          
          err.status = "failed";
          reject(err);
        }
        else {             
          resolve({"status":"success","newTransaction": newTransaction.Item});
        }
      });
    });
  }

  updateDashBoardInfo(transaction){
    return new Promise((resolve,reject) => {
        let dashboard = {
          personId: transaction.personId,
          transactionType: util.getDashboardType(transaction.type),
          amount: transaction.amount
        };
        let dashParams = {
          TableName: tables["dashboard"],
          Key: {
            "personId": dashboard.personId,
          },
          UpdateExpression: 'SET amount = amount + :amount, transactionType = :type',
          ExpressionAttributeValues: {
            ":amount": dashboard.amount,
            ":type": dashboard.transactionType
          },
          ReturnValues: 'UPDATED_NEW',
        };
        
        dynamoClient.update(dashParams, function (err, data) {
          if (err) {
            reject({ "status": "fail", "reason": err })
          }
          else if (data) {
            resolve({ "status": "success", "message": "transaction added successfully", "data": data });
          }
        });
    });
  }

  addDashboardInfo(transaction) {
    return new Promise((resolve, reject) => {
      let dashboard = {
        personId: transaction.personId,
        history: {
          "credits": util.getDashboardType(transaction.type,transaction.amount),
          "debits":5000
        },
        transactionType: util.getDashboardType(transaction.type),
        amount: transaction.amount
      };
      let dashParams = {
        TableName: tables["dashboard"],
        Item:dashboard,
        ConditionExpression: 'attribute_not_exists(personId)',
        ReturnValues: 'ALL_OLD',
      };      
      dynamoClient.put(dashParams, function (err, data) {
        if (err) {
          reject({ "status": "fail", "reason": err })
        }
        else if (data) {
          resolve({ "status": "success", "message": "transaction added successfully", "data": data });
        }
      });
    });
  }

  dashboardInfoExist(transaction) {
    return new Promise((resolve, reject) => {
      
      let dashboardInfoExist = {
        TableName: tables["dashboard"],
        KeyConditionExpression: '#whose = :value',
        ExpressionAttributeNames: {
          '#whose': 'personId'
        },
        ExpressionAttributeValues: {
          ':value': transaction.personId
        }
      };
      
      dynamoClient.query(dashboardInfoExist, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
     
  addMultipleTransactions(transactions) {
    return new Promise((resolve, reject) => {
      let addedTransactions = []; let promises = [];
      //resolve("added multiple");
      transactions.forEach(transaction => {
        promises.push(this.addNewTransaction(transaction).then(data => {
          addedTransactions.push(data);
        }).catch(err => {
          addedTransactions.push(err);
        }));
      });
      Promise.all(promises).then(() => {
        resolve(addedTransactions);
      });
    });
  }

  async updateTransactonDetails(transaction){
    let uTrDetails = await UpdateTransaction(transaction);
    let uDashInfo;
    if(uTrDetails && uTrDetails.status === "success"){
      uDashInfo = this.updateDashBoardInfo(uTrDetails.updatedTransaction)
    }
    return uDashInfo;
  }
  
  UpdateTransaction(transaction) {
    return new Promise((resolve, reject) => {
      let uTr = this.updateParamsForDb(transaction);
      dynamoClient.update(uTr, function (err, data) {
        if (err) {
          err.status = "failed";
          reject(err);
        }
        else {    
          data.Attributes.personId = transaction.personId;      
          resolve({"status": "success","updatedTransaction": data.Attributes});        
        }
      });
    });
}


  DeleteTransaction(transation) {

  }

  //Util functions
  putParamsForDb(transaction) {

    if (transaction) {
      transaction.id = uuid();
      transaction.date = util.FormatToISO8601(new Date(transaction.date));
      transaction.modifiedDate = util.FormatToISO8601(new Date(transaction.date));
      transaction.amount = parseFloat(transaction.amount);
    }
    var params = {
      TableName: tables["transactions"],
      Item: transaction,
      ConditionExpression: 'attribute_not_exists(id)',
      ReturnValues: 'ALL_OLD',
    };
    return params;
  }

  getParamsForDb(transactionId,LastEvaluatedKey) {
    var params = {
      TableName: tables["transactions"],
      IndexName: tables["IdxPersonTransactions"],
      KeyConditionExpression: '#whose = :value',
      ExpressionAttributeNames: {
        '#whose': 'personId'
      },
      ExpressionAttributeValues: {
        ':value': transactionId
      },
      ScanIndexForward:false
    };
    if(LastEvaluatedKey){
      params.ExclusiveStartKey = LastEvaluatedKey;
    }
    return params;
  }

  updateParamsForDb(transaction) {
    
    if(transaction){      
      transaction.modifiedDate = util.FormatToISO8601(new Date(transaction.date));
      transaction.amount = parseFloat(transaction.amount);
      transaction.type = parseInt(transaction.type);
    }
    
    var params = {
      TableName: tables["transactions"],
      Key: {
        "id": transaction.id
      },
      UpdateExpression: 'SET amount = :amount, #type = :type, reason = :reason, modifiedDate = :modifiedDate',
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames:{
        "#type":"type"
      },
      ExpressionAttributeValues: {
        ":amount": transaction.amount,
        ":type": transaction.type,
        ":reason": transaction.reason,
        ":modifiedDate":transaction.modifiedDate
      },
      ReturnValues: 'UPDATED_NEW',
    };

    return params;
  }

  deleteParams(deletePerson) {
    var params = {
      TableName: tables["persons"],
      Key: {
        "belongsTo": deletePerson.belongsTo,
        "id": deletePerson.id
      },
      ConditionExpression: 'attribute_exists(belongsTo) AND attribute_exists(id)',
      ReturnValues: 'NONE',
    };
    return params;
  }



}

export default new transactionsRepo();
