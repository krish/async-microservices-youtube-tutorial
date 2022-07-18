# SAGA pattern microservice demo

## Related video can find bellow link

 https://youtu.be/pb0-HvDxGLI

## commands used in the video

to run kafka on local

`docker-compose -f docker-compose.yml up`

use `-d` if you want to run kafka from detached from terminal

log in to kafka terminal

`docker exec -it kafka bash`

to create new topic / list topoc / delete topics

`cd /opt/kafka/bin`

`kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 2 --topic new-connection`

`kafka-topics.sh --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 2 --topic new-connection-response`

to list the topics

`kafka-topics.sh --list --zookeeper zookeeper:2181`
