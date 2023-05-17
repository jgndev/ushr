## Creating the DynamoDB table in AWS

aws dynamodb create-table \
 --table-name ushr \
 --attribute-definitions AttributeName=id,AttributeType=S AttributeName=originalUrl,AttributeType=S \
 --key-schema AttributeName=id,KeyType=HASH \
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
 --global-secondary-indexes 'IndexName=originalUrl-index,KeySchema=[{AttributeName=originalUrl,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}' \
 --region us-east-1
