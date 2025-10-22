import json
import boto3
import os
from uuid import uuid4
import logging

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['ARTISTS_TABLE']
table = dynamodb.Table(table_name)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Received event: %s", event)
    try:
        body = json.loads(event['body'])
        name = body.get('name')
        biography = body.get('biography')
        genres = body.get('genres', [])

        if not name or not biography:
            return {
                'statusCode': 400,
                "headers": {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                'body': json.dumps({'message': 'Name and biography are required'})
            }

        artist_id = str(uuid4())
        item = {
            'artistId': artist_id,
            'name': name,
            'biography': biography,
            'genres': genres
        }

        table.put_item(Item=item)

        return {
            'statusCode': 201,
            "headers": {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            'body': json.dumps({'message': 'Artist created', 'artist': item})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            "headers": {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            'body': json.dumps({'message': str(e)})
       }