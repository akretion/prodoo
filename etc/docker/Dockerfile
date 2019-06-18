FROM 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/docker-nginx-proxy

# Add app structure
ADD .dist/ $OSTORE_APP

COPY scripts/run.sh $OSTORE_BINS
RUN chmod +x $OSTORE_BINS/run.sh
CMD run.sh

WORKDIR $OSTORE_APP
