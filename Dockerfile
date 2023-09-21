#FROM nvidia/cuda:12.2.0-devel-ubuntu20.04
# let's try to downgrade the version of CUDA
FROM nvidia/cuda:11.8.0-devel-ubuntu20.04

LABEL maintainer="Hugging Face"

ARG DEBIAN_FRONTEND=noninteractive

# Use login shell to read variables from `~/.profile` (to pass dynamic created variables between RUN commands)
SHELL ["sh", "-lc"]

# WORKDIR /workdir

RUN apt update

# base stuff
RUN apt --yes install build-essential wget curl rpl

RUN echo "Build started at: $(date "+%Y-%m-%d %H:%M")"

# NodeJS - LEGACY/DEPRECATED WAY
#RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
#RUN apt --yes install nodejs

# NodeJS - NEW, MORE ANNOYING WAY
RUN apt --yes install -y ca-certificates gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
ENV NODE_MAJOR=18
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt update
RUN apt --yes install nodejs

# git and file management
RUN apt --yes install git git-lfs unzip
RUN git lfs install

# Python
RUN apt --yes install python3 python3-pip
RUN python3 -m pip install --no-cache-dir --upgrade pip


# required for CMake it seems
RUN apt --yes install libtbb-dev libeigen3-dev g++ libssl-dev checkinstall


# The app require CMake 3.24+ but this version of Ubuntu only has the 3.16
# So we need to install a more recent version
#RUN apt-get update \
#  && rm -rf /var/lib/apt/lists/* \
RUN wget https://github.com/Kitware/CMake/releases/download/v3.24.1/cmake-3.24.1-Linux-x86_64.sh \
  -q -O /tmp/cmake-install.sh \
  && chmod u+x /tmp/cmake-install.sh \
  && mkdir /opt/cmake-3.24.1 \
  && /tmp/cmake-install.sh --skip-license --prefix=/opt/cmake-3.24.1 \
  && rm /tmp/cmake-install.sh \
  && ln -s /opt/cmake-3.24.1/bin/* /usr/local/bin

# Install cmake 3.24
#RUN wget https://github.com/Kitware/CMake/releases/download/v3.24.1/cmake-3.22.1.tar.gz \
# && tar -zvxf cmake-3.24.1.tar.gz \
# && cd cmake-3.24.1 \
# && ./bootstrap \
# && make -j8 \
# && checkinstall --pkgname=cmake --pkgversion="3.20-custom" --default
# Copy contents from 2 levels up
#COPY . ./

# Download and extract libtorch
#RUN wget https://download.pytorch.org/libtorch/cu118/libtorch-cxx11-abi-shared-with-deps-2.0.1%2Bcu118.zip \
# && unzip libtorch-cxx11-abi-shared-with-deps-2.0.1+cu118.zip -d external/

# Set up a new user named "user" with user ID 1000
RUN useradd -o -u 1000 user

# Switch to the "user" user
USER user

ENV PYTHON_BIN /usr/bin/python3

#ENV PATH /usr/local/cuda-12.2/bin:$PATH
#ENV LD_LIBRARY_PATH /usr/local/cuda-12.2/lib64:$LD_LIBRARY_PATH
# Let's try to downgrade
ENV PATH /usr/local/cuda-11.8/bin:$PATH
ENV LD_LIBRARY_PATH /usr/local/cuda-11.8/lib64:$LD_LIBRARY_PATH


# Set home to the user's home directory
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR $HOME/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=user package*.json $HOME/app

RUN npm install

# Copy the current directory contents into the container at $HOME/app setting the owner to the user
COPY --chown=user . $HOME/app

RUN git clone --recursive https://github.com/MrNeRF/gaussian-splatting-cuda

WORKDIR $HOME/app/gaussian-splatting-cuda

# for quick testing we disabled the rest

COPY --chown=user . $HOME/app/gaussian-splatting-cuda

WORKDIR $HOME/app

RUN echo "Build ended at: $(date "+%Y-%m-%d %H:%M")"

EXPOSE 7860

# we can't use this (it time out)
# CMD [ "xvfb-run", "-s", "-ac -screen 0 1920x1080x24", "npm", "run", "start" ]
CMD [ "npm", "run", "start" ]
