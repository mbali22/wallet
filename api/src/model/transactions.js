
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

  async AddTransaction(transaction) {
    let addedTransaction = await this.insertTransactionToDb(transaction);
    return addedTransaction;
  }

  insertTransactionToDb(transaction) {
    return new Promise((resolve, reject) => {
      let newTransaction = this.putParamsForDb(transaction);
      resolve(newTransaction);
      dynamoClient.put(newTransaction, function (err, data) {
        if (err) {
          err.status = "failed";
          reject(err);
        }
        else {
          resolve({ "status": "success", "response": data });
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
      transaction.date = FormatToISO8601(transaction.date);
      transaction.modifiedDate = FormatToISO8601(transaction.date);
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
