function handler () {
  EVENT_DATA=$1
  echo "$EVENT_DATA" 1>&2;
  aws s3api list-buckets
  RESPONSE="Echoing request: '$EVENT_DATA'"

  echo $RESPONSE
}