
import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import uuid from "uuid/v1";
import { FormatToISO8601 } from "../helpers/utility";

class transactionsRepo {
  constructor() {
  }

  GetDashBoardInfo() {

  }

  AddTransaction(transaction) {

  }

  insertTransactionToDb(transaction){
    return new Promise((resolve, reject) => {
      let newTransaction = this.putParamsForDb(transaction);            
      dynamoClient.put(newTransaction, function (err, data) {
          if (err) {
              err.status = "failed";
              reject(err);
          }
          else {
              resolve({ "status": "success", "response":data });
          }
      });
  });      
}

  AddMultipleTransaction(transactions) {

  }

  UpdateTransaction(transation) {

  }

  DeleteTransaction(transation) {

  }

  //Util functions
  putParamsForDb(transaction) {
     if(transaction){
       transaction.date = FormatToISO8601(transaction.date);
       transaction.modifiedDate = FormatToISO8601(new Date());       
     }
    var params = {
      TableName: tables["transactions"],
      Item: person,
      ConditionExpression: 'attribute_not_exists(personId) AND attribute_not_exists(date)',
      ReturnValues: 'ALL_OLD', // optional (NONE | ALL_OLD)
    };
    return params;
  }

  getParamsForDb(transaction) {
    var params = {
      TableName: tables["transactions"],
      KeyConditionExpression: '#whose = :value',
      ExpressionAttributeNames: {
        '#whose': 'personId'
      },
      ExpressionAttributeValues: { 
        ':value': transaction.personId
      }
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
