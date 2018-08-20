FROM 721728311103.dkr.ecr.eu-west-1.amazonaws.com/oliverstore/webapp

# Image blueprint
ARG OSTORE_IMAGE_NAME=prodoo
ARG OSTORE_IMAGE_VERSION=latest

# Add app structure
ADD .dist/ $OSTORE_APP

WORKDIR ${OSTORE_ANSIBLE}
RUN ssh-agent bash \
      -c 'ssh-add ${OSTORE_KEYS}/${OSTORE_IMAGE_GIT_SSH_KEYNAME} \
            && git clone  --branch ${OSTORE_IMAGE_NAME} --single-branch ${OSTORE_IMAGE_GIT_SSH_REPO_URL}  tmp-repo \
            && cp -r tmp-repo/* . \
            && rm -rf tmp-repo'

RUN ansible-playbook main.yml

# copy the run script, set proper privileges and run 
COPY scripts/run.sh $OSTORE_BINS
RUN chmod +x $OSTORE_BINS/run.sh
CMD run.sh

WORKDIR $OSTORE_APP
