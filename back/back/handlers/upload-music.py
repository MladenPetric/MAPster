import os
import boto3
import uuid
from datetime import datetime

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

MUSIC_BUCKET = os.environ['MUSIC_BUCKET']
FILES_TABLE = os.environ['MUSIC_FILES_TABLE']
META_TABLE = os.environ['MUSIC_META_TABLE']

files_table = dynamodb.Table(FILES_TABLE)
meta_table = dynamodb.Table(META_TABLE)


def lambda_handler(event, context):
    try:
        # Ako dolazi kao multipart/form-data iz Angulara
        body = event.get('body', None)
        if event.get('isBase64Encoded', False):
            import base64
            body = base64.b64decode(body)

        import cgi
        env = {'REQUEST_METHOD': 'POST'}
        fs = cgi.FieldStorage(fp=body, environ=env, headers=event.get('headers'))

        title = fs.getvalue('title')
        artist_id = fs.getvalue('artist')  # SAMO JEDAN
        album_id = fs.getvalue('album', '')
        genres = fs.getlist('genre')
        file_item = fs['file']

        music_id = str(uuid.uuid4())
        s3_key = f"{music_id}/{file_item.filename}"
        s3.upload_fileobj(file_item.file, MUSIC_BUCKET, s3_key)

        # Meta podaci fajla
        files_table.put_item(Item={
            'musicId': music_id,
            's3Key': s3_key,
            'fileName': file_item.filename,
            'fileType': file_item.type,
            'fileSize': file_item.length,
            'createdAt': datetime.utcnow().isoformat(),
            'updatedAt': datetime.utcnow().isoformat()
        })

        # Ostali podaci o muzici
        meta_table.put_item(Item={
            'musicId': music_id,
            'title': title,
            'artistId': artist_id,  # SAMO JEDAN
            'albumId': album_id if album_id else None,
            'genres': genres
        })

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': f'Music uploaded successfully with id {music_id}'
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': f'Error uploading music: {str(e)}'
        }