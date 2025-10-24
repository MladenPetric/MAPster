import boto3
import os
import json
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
albums_table = dynamodb.Table(os.environ['ALBUMS_TABLE'])

def lambda_handler(event, context):
    album_id = event['pathParameters'].get('albumId')

    try:
        response = albums_table.query(
            IndexName='albumId-index',
            KeyConditionExpression=Key('albumId').eq(album_id)
        )

        items = response.get('Items', [])

        if not items:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Album not found'})
            }

        album = items[0]

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(album)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
