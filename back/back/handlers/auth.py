import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client('cognito-idp')

#validacija mejla
def preSignUp(event, context):
    user_pool_id = event['userPoolId']
    email = event['request']['userAttributes'].get('email')

    if email:
        existing_users = client.list_users(
            UserPoolId=user_pool_id,
            AttributesToGet=['email'],
            Filter=f'email = "{email}"'
        )

        if existing_users['Users']:
            logger.info("Email already exists")

    return event

#dodaje rolu
def postConfirmation(event, context):
    user_pool_id = event['userPoolId']
    username = event['userName']
    group_name = 'User'

    try:
        client.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=username,
            GroupName=group_name
        )
        logger.info("User %s added to group %s", username, group_name)
    except Exception as e:
        logger.info("Error adding user to group: %s", e)

    return event