import boto3
import json
import os
from boto3.dynamodb.conditions import Key, Attr
from .get_artists import lambda_handler as artists_handler
from .get_album import lambda_handler as albums_handler
from urllib.parse import parse_qs
dynamodb = boto3.resource('dynamodb')
albums_table = dynamodb.Table(os.environ['ALBUMS_TABLE'])
artists_table = dynamodb.Table(os.environ['ARTISTS_TABLE'])

def filter_handler(event, context):
    params = event.get('queryStringParameters') or {}
    if not params and 'rawQueryString' in event:
        params = {k: v[0] for k, v in parse_qs(event['rawQueryString']).items()}
    print(params)
    genre = params.get('genre')
    print(genre)
    if genre:
        album_response = albums_table.query( KeyConditionExpression=Key('genre').eq(genre) )
        artist_response = artists_table.scan(
            FilterExpression=Attr('genres').contains(genre)
        )
        print(artist_response)
        albums = album_response.get('Items', [])
        artists = artist_response.get('Items', [])
        print(artists)
        result = {
            'genre': genre,
            'albums': albums,
            'artists': artists
        }

    else:
        #Ako nema žanra – samo pozovemo postojeći get_all_handler
        albums_data = albums_handler(event, context)
        artists_data = artists_handler(event, context)
        print("FUNKCIJE DOBRE")
        #get_all_handler vraća kompletan HTTP odgovor, pa parsiramo body
        albums_body = json.loads(albums_data['body'])
        artists_body = json.loads(artists_data['body'])
        result = {
            'genre': 'all',
            'albums': albums_body,
            'artists': artists_body
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result)
    }
