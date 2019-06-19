FROM 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/docker-nginx-proxy

# Add app structure
ADD .dist/ $OSTORE_APP

# Add nginx prodoo config
# ADD .etc/config/prodoo/prodoo.conf /etc/nginx/sites-enabled/ 

# # CONFIGURE
# COPY etc/docker/scripts/configure.sh $OS_BINS/configure.sh
# RUN chmod +x $OS_BINS/configure.sh
# RUN $OS_BINS/configure.sh

# # RUN
# COPY etc/docker/scripts/run.sh $OS_BINS/run.sh
# RUN chmod +x $OS_BINS/run.sh

# # Init
# CMD run.sh

# Set workig dir
WORKDIR $OSTORE_APP
