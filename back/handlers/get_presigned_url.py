import boto3
import json
import os
import uuid
from datetime import datetime

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['MUSIC_BUCKET']
table_name = os.environ['MUSIC_FILES_TABLE']
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
    except:
        return {"statusCode": 400, "body": json.dumps({"message": "Invalid JSON body"})}
    
    filename = body['filename']
    content_type = body['contentType']

    music_id = str(uuid.uuid4())
    s3_key = f"songs/{music_id}-{filename}"

    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': bucket_name, 'Key': s3_key, 'ContentType': content_type},
        ExpiresIn=3600
    )

    # čuvamo metapodatke o fajlu u MusicFilesTable
    table.put_item(Item={
        'musicId': music_id,
        'filename': filename,
        'contentType': content_type,
        's3Key': s3_key,
        'uploadedAt': datetime.utcnow().isoformat()
    })

    return {
        "statusCode": 200,
         "headers": {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
         },
        "body": json.dumps({
            "uploadUrl": presigned_url,
            "musicId": music_id
        })    
    }
