
import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import uuid from "uuid/v1";
import util from "../helpers/utility";
import config from "../config";

const {dashBoard} = config;

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
    //let trResponse = await this.insertTransaction(transaction);    
    if(true){      
    //if(trResponse && trResponse.status === "success"){      
      //let infoExist = await this.dashboardInfoExist(trResponse.newTransaction);
      //console.log(infoExist);
      if(false){ 
      //if(infoExist && infoExist.Count == 0){  
          console.log("workingggg");       
          let newDashBoardInfo = await this.addDashboardInfo(transaction);
          return newDashBoardInfo;
      }else{      
          console.log("not workinggg");
          //let updatedInfo = await this.updateDashBoardInfo(trResponse.newTransaction);          
          let updatedInfo = await this.updateDashBoardInfo(transaction);          
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
        let attriButesValues = {}; let setExpression = 'SET';
        let dashboard = {
          personId: transaction.personId                 
        };
        let trType = util.getDashboardType(transaction.type);     
        if(trType === dashBoard.credit){
          dashboard.history = {
            credits : util.getDashboardTypeAmount(transaction.type,transaction.amount)
          }
          attriButesValues[":credit"] = dashboard.history.credits;
          setExpression = setExpression + " history.credits = history.credits + :credit";
        }else if(trType === dashBoard.debit){
          dashboard.history = {
            debits : util.getDashboardTypeAmount(transaction.type,transaction.amount)
          }
          attriButesValues[":debit"] = dashboard.history.debits;
          setExpression = setExpression + " history.debits = history.debits + :debit";
        }else if(trType === dashBoard.expense){
          dashboard.history = {
            expense : util.getDashboardTypeAmount(transaction.type,transaction.amount)
          }
          attriButesValues[":expense"] = dashboard.history.expense;
          setExpression = setExpression + " history.expense = history.expense + :expense";
        }
        
        let dashParams = {
          TableName: tables["dashboard"],
          Key: {
            "personId": dashboard.personId,
          },
          UpdateExpression: setExpression,
          ExpressionAttributeValues: attriButesValues,
          ReturnValues: 'UPDATED_NEW',
        };
        resolve(dashParams);
        // dynamoClient.update(dashParams, function (err, data) {
        //   if (err) {
        //     reject({ "status": "fail", "reason": err })
        //   }
        //   else if (data) {
        //     resolve({ "status": "success", "message": "transaction added successfully", "data": data });
        //   }
        // });
    });
  }

  addDashboardInfo(transaction) {
    return new Promise((resolve, reject) => {             
        
        let dashboard = {
          personId: transaction.personId               
        };

        let trType = util.getDashboardType(transaction.type);     
                
        if(trType === dashBoard.credit){          
          dashboard.history = {
            credits : util.getDashboardTypeAmount(transaction.type,transaction.amount)
          }          
        }else if(trType === dashBoard.debit){
          dashboard.history = {
            debits : util.getDashboardTypeAmount(transaction.type,transaction.amount)
          };
        }else if(trType === dashBoard.expense){
          dashboard.history = {
            expense : util.getDashboardTypeAmount(transaction.type,transaction.amount)
          }
        }
        
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
