import boto3
import os
import json
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
songs_table = dynamodb.Table(os.environ['MUSIC_META_TABLE'])

def lambda_handler(event, context):
    artist_id = event['pathParameters'].get('artistId')
    print(f"Fetching songs for albumId: {artist_id}")

    # Scan sa filterom po albumId
    response = songs_table.scan(
        FilterExpression=Attr('artist').eq(artist_id)
    )
    
    songs = response.get('Items', [])
    print(songs)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(songs)
    }
