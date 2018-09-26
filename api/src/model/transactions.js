
import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import uuid from "uuid/v1";

class transactionsRepo {
  constructor() {
  }

  GetDashBoardInfo() {

  }

  AddTransaction(transaction) {

  }

  InsertTransactionToDb(){

  }

  AddMultipleTransaction(transactions) {

  }

  UpdateTransaction(transation) {

  }

  DeleteTransaction(transation) {

  }

  //Util functions
  putParamsForDb(transaction) {

    var params = {
      TableName: tables["transactions"],
      Item: person,
      ConditionExpression: 'attribute_not_exists(PersonId) AND attribute_not_exists(date)',
      ReturnValues: 'ALL_OLD', // optional (NONE | ALL_OLD)
    };
    return params;
  }

  getParamsForDb(personId) {
    var params = {
      TableName: tables["persons"],
      KeyConditionExpression: '#whose = :value',
      ExpressionAttributeNames: {
        '#whose': 'belongsTo'
      },
      ExpressionAttributeValues: { // a map of substitutions for all attribute values
        ':value': personId
      }
    };
    return params;
  }

  updateParamsForDb(person) {
    var params = {
      TableName: tables["persons"],
      Key: {
        "belongsTo": person.belongsTo,
        "id": person.id
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
