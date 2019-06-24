FROM 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/docker-nginx-proxy:1.0.0
LABEL MAINTAINER OliverStore<informatique@oliverstore.com>

# Component args
ARG COMPONENT_NAME
ARG COMPONENT_TYPE

# Prodoo build args
ARG PRODOO_PROXY_URL

ENV OS_COMPONENT_NAME $COMPONENT_NAME
ENV OS_COMPONENT_TYPE $COMPONENT_TYPE

ENV GPS_PROJECT_NAME=$COMPONENT_NAME

ENV NGINX_PROXY_USER=www-data

LABEL os:project:name="$OS_COMPONENT_NAME" \
      os:component:name="$OS_COMPONENT_NAME" \
      os:component:type="$OS_COMPONENT_TYPE"

# RUN
COPY scripts/run.sh $OS_BINS/run.sh
RUN chmod +x $OS_BINS/run.sh

# Add app structure
ADD .dist/ $OS_APP

# Copy all needed config files
COPY ./etc/config/nginx/ $OS_CONFIG/sites-enabled/

# Init
CMD $OS_BINS/run.sh

WORKDIR $OS_APP