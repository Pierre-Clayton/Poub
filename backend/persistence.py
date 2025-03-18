# mvp/backend/persistence.py

import os
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb", region_name=os.getenv("AWS_REGION", "us-east-1"))

DOCUMENTS_TABLE_NAME = os.getenv("DOCUMENTS_TABLE", "Documents")
CONVERSATIONS_TABLE_NAME = os.getenv("CONVERSATIONS_TABLE", "Conversations")

def save_document(user_id: str, filename: str, doc_data: list):
    """
    Sauvegarde le document traité dans la table Documents.
    """
    table = dynamodb.Table(DOCUMENTS_TABLE_NAME)
    try:
        table.put_item(
            Item={
                "user_id": user_id,
                "filename": filename,
                "data": doc_data
            }
        )
    except ClientError as e:
        raise Exception("Failed to save document: " + e.response['Error']['Message'])

def append_conversation(user_id: str, message: dict):
    """
    Ajoute un message (dictionnaire {role, content}) à l'historique de conversation de l'utilisateur.
    """
    table = dynamodb.Table(CONVERSATIONS_TABLE_NAME)
    try:
        table.update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET #hist = list_append(if_not_exists(#hist, :empty_list), :msg)",
            ExpressionAttributeNames={"#hist": "history"},
            ExpressionAttributeValues={
                ":msg": [message],
                ":empty_list": []
            }
        )
    except ClientError as e:
        raise Exception("Failed to append conversation: " + e.response['Error']['Message'])

def get_conversation(user_id: str):
    """
    Récupère l'historique de conversation de l'utilisateur.
    """
    table = dynamodb.Table(CONVERSATIONS_TABLE_NAME)
    try:
        response = table.get_item(Key={"user_id": user_id})
        return response.get("Item", {}).get("history", [])
    except ClientError as e:
        raise Exception("Failed to get conversation: " + e.response['Error']['Message'])
