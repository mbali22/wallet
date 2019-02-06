
import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import uuid from "uuid/v1";
import util from "../helpers/utility";
import config from "../config";
import personrepo from './person';

const {dashBoard} = config;

class transactionsRepo {
  async GetDashBoardInfo(personsId) {
    let dashBoardInfo = {
      personHistory:[],
      board:{
        credits:0,
        debits:0,
        expense:0
      }
    };
    let dashBoardRecords = await this.getDashBoardParams();
    let persons = await personrepo.getPersonsById(personsId);       
    if(dashBoardRecords && dashBoardRecords.Count > 0){  
      let credits = 0; let debits = 0; let expense = 0;        
      dashBoardRecords.Items.forEach(board => {  
            let person = {};
            person.id = board.personId;            
            let sPerson = persons.Items.filter(p => p.id === board.personId)[0]
            person.name = sPerson.fname + " " + sPerson.lname;
            
            if(board.history.credits < board.history.debits){                
                debits = debits + (board.history.debits - board.history.credits);
                person.debits = board.history.debits - board.history.credits;
            }
            else if(board.history.credits == board.history.debits){
                credits = credits + 0;
                debits = debits + 0;
                person.debits = 0;
                person.credits = 0;
            }
            else{
                credits = credits + (board.history.credits - board.history.debits);                
                person.credits = board.history.credits - board.history.debits;                
            }
            expense = expense + board.history.expense;

            dashBoardInfo.personHistory.push(person);

      });
      dashBoardInfo.board.debits = debits;
      dashBoardInfo.board.credits = credits;
      dashBoardInfo.board.expense = expense;
    }
    return dashBoardInfo;
  }
  getTransactionsByPersonId(transactionId,LastEvaluatedKey = null) {
    return new Promise((resolve, reject) => {
      let getParams = this.getParamsForDb(transactionId,LastEvaluatedKey);
      let transactions = [];
      dynamoClient.query(getParams, function (err, data) {
        if (err) {
          reject(err);
        } else {
          if(data.LastEvaluatedKey){
            transactions.push(data);
            getTransactionsByPersonId(transactionId,LastEvaluatedKey)
          }
          else{
            transactions.push(data);
            resolve(transactions);
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
          let newDashBoardInfo = await this.addDashboardInfo(trResponse.newTransaction);          
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
        let attriButesValues = {}; let setExpression = 'SET';
        let dashboard = {
          userid:transaction.userid,
          personid: transaction.personid,
          history:{
            credits: 0,
            debits : 0,
            expense: 0
          }         
        };

        let trType = util.getDashboardType(transaction.type);                     
        if(trType === dashBoard.credit){
          dashboard.history.credits = util.getDashboardTypeAmount(transaction.type,transaction.amount)          
          attriButesValues[":credit"] = dashboard.history.credits;
          setExpression = setExpression + " history.credits = history.credits + :credit";
        }else if(trType === dashBoard.debit){
          dashboard.history.debits = util.getDashboardTypeAmount(transaction.type,transaction.amount)          
          attriButesValues[":debit"] = dashboard.history.debits;
          setExpression = setExpression + " history.debits = history.debits + :debit";
        }else if(trType === dashBoard.expense){
          dashboard.history.expense = util.getDashboardTypeAmount(transaction.type,transaction.amount)          
          attriButesValues[":expense"] = dashboard.history.expense;
          setExpression = setExpression + " history.expense = history.expense + :expense";
        }
        
        let dashParams = {
          TableName: tables["dashboard"],
          Key: {
            "userid": dashboard.userid,
            "personid":dashboard.personid
          },
          UpdateExpression: setExpression,
          ExpressionAttributeValues: attriButesValues,
          ReturnValues: 'ALL_NEW',
        };        
        resolve(dashParams);
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
          userid:transaction.userid,
          personid: transaction.personid,
          history:{
            credits: 0,
            debits : 0,
            expense: 0
          }       
        };

        let trType = util.getDashboardType(transaction.type);     
                
        if(trType === dashBoard.credit){          
          dashboard.history.credits = util.getDashboardTypeAmount(transaction.type,transaction.amount)          
        }else if(trType === dashBoard.debit){
          dashboard.history = util.getDashboardTypeAmount(transaction.type,transaction.amount)          
        }else if(trType === dashBoard.expense){
          dashboard.history = util.getDashboardTypeAmount(transaction.type,transaction.amount)          
        }        
        let dashParams = {
          TableName: tables["dashboard"],
          Item:dashboard,
          ConditionExpression: 'attribute_not_exists(userid) and attribute_not_exists(personid)',
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
        KeyConditionExpression: 'userid = :userid and personid=:personid',        
        ExpressionAttributeValues: {          
          ':userid': transaction.userid,
          ':personid':transaction.personid
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
  
 async UpdateTransaction(transaction) {
    let utransaction = await this.updatePersonTransaction(transaction);    
    return await this.updateDashBoardInfo(utransaction);
 }

  updatePersonTransaction(transaction){
    return new Promise((resolve, reject) => {
      let uTr = this.updateParamsForDb(transaction);          
      dynamoClient.update(uTr, function (err, data) {
        if (err) {
          err.status = "failed";
          reject(err);          
        }
        else {                 
          resolve(data.Attributes);
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
      ReturnValues: 'ALL_OLD',
    };
    return params;
  }

  getParamsForDb(personid,userid,LastEvaluatedKey) {
    var params = {
      TableName: tables["transactions"],      
      IndexName: tables["IdxPersonTransactions"],
      KeyConditionExpression: '#whose = :value',
      ExpressionAttributeNames: {
        '#whose': 'personId'
      },
      ExpressionAttributeValues: {
        ':value': personid
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
      transaction.modifiedDate = util.FormatToISO8601(new Date());
      transaction.amount = parseFloat(transaction.amount);
      transaction.type = parseInt(transaction.type);
    }
    
    var params = {
      TableName: tables["transactions"],
      Key: {
        "id": transaction.id        
      },
      UpdateExpression: 'SET amount = :amount, #type = :type, reason = :reason, modifiedDate = :modifiedDate, personid = :personid',      
      ExpressionAttributeNames:{
        "#type":"type"
      },
      ExpressionAttributeValues: {
        ":amount": transaction.amount,
        ":type": transaction.type,
        ":reason": transaction.reason,
        ":modifiedDate":transaction.modifiedDate,
        ":personid":transaction.personid      
      },
      ReturnValues: 'ALL_NEW',
    };

    return params;
  }

  getDashBoardParams(LastEvaluatedKey = null) {
    return new Promise((resolve, reject) => {
      let dashBoardRecords = [];
      let dashparams = {
        TableName: 'dashboard',
      }
      if(dashparams){
        dashparams.ExclusiveStartKey = LastEvaluatedKey;
      }
       dynamoClient.scan(dashparams, function (err, data) {
       if(err){
          reject(err);
        }else{
          if(data.LastEvaluatedKey){
            dashBoardRecords.push(data);
            getDashBoardParams(LastEvaluatedKey);
          }
          else{
            dashBoardRecords.push(data);
            resolve(dashBoardRecords[0]);
          }
        }
      });
    });
  }

  deleteParams(transactionid) {
    var params = {
      TableName: tables["transactions"],
      Key: {        
        "id": transactionid
      },      
      ReturnValues: 'NONE',
    };
    return params;
  }

}

export default new transactionsRepo();
