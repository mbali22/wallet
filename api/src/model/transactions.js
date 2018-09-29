
import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import uuid from "uuid/v1";
import util from "../helpers/utility";

class transactionsRepo {
  

  GetDashBoardInfo() {

  }

  getTransactionsByPersonId(personId) {
    return new Promise((resolve, reject) => {
      let getParams = this.getParamsForDb(personId);
      dynamoClient.query(getParams, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async addTransaction(transaction) {    
    let addedTransaction = await this.insertTransaction(transaction);
    return addedTransaction;
  }
  
  async insertTransaction(transaction){
    let transactionStatus = await this.insertTransactionToDb(transaction);
    let dashboardStatus;
    if(transactionStatus.status === "success"){
      dashboardStatus = await this.addDashboardInfo(transaction);      
    }
    return dashboardStatus;
  }

  insertTransactionToDb(transaction) {
    return new Promise((resolve, reject) => {      
      let newTransaction = this.putParamsForDb(transaction);      
      dynamoClient.put(newTransaction, function (err, data) {
        if (err) {
          err.status = "failed";
          reject(err);
        }
        else {           
          resolve({"status":"success","newTransaction": newTransaction});
        }
      });
    });
  }

  async addDashboardInfo(transaction) {   
      let infoExist = await dashboardInfoExist(transaction);
      if(infoExist.Item.Count == 0){
        let addedInfo = await this.insertDashboard(transaction);
        return addedInfo;
      }else{
       let updatedInfo = await this.updateDashBoardInfo(transaction);
       return updatedInfo;
      }   
  }
  
  updateDashBoardInfo(){
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

  dashboardInfoExist(transaction) {
    return new Promise((resolve, reject) => {
      var dashboardInfoExist = {
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
   
  insertDashboard(transaction){
    return new Promise((resolve, reject) => {      
      let dashboard = {
        personId: transaction.personId,
        transactionType: util.getDashboardType(transaction.type),
        amount: transaction.amount
      };
      let dashParams = {
        TableName: tables["dashboard"],
        Item: dashboard,        
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

  AddMultipleTransaction(transactions) {
    return new Promise((resolve, reject) => {
      let addedTransactions = []; let promises = [];
      transactions.forEach(transaction => {
        promises.push(this.insertPersonToDB(transaction).then(data => {
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

  UpdateTransaction(transation) {

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

  getParamsForDb(transaction) {
    var params = {
      TableName: tables["transactions"],
      IndexName: tables["IdxPersonTransactions"],
      KeyConditionExpression: '#whose = :value',
      ExpressionAttributeNames: {
        '#whose': 'personId'
      },
      ExpressionAttributeValues: {
        ':value': transaction.personId
      },
      ScanIndexForward:false
    };
    return params;
  }

  updateParamsForDb(person) {
    var params = {
      TableName: tables["transactions"],
      Key: {
        "personId": person.personId,
        "date": person.date
      },
      UpdateExpression: 'SET fname = :fname, lname = :lname, Mobile = :Mobile',
      ConditionExpression: 'attribute_exists(belongsTo) AND attribute_exists(id)',
      ExpressionAttributeValues: {
        ":lname": person.lname,
        ":fname": person.fname,
        ":Mobile": person.Mobile
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
