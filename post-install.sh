#!/bin/bash
# This script is used to install the remaining of the app requiring CUDA stuff

echo "Running post-install script (go take a coffee, this is gonna take a while)"

echo "cmake -B build"
# cmake -B build -D CMAKE_BUILD_TYPE=Release -D CUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda-12.2/ -D CUDA_VERSION=12.2
cmake -B build -D CMAKE_BUILD_TYPE=Release -D CUDA_VERSION=12.2

echo "cmake --build build"
cmake --build build -- -j8

echo "dependency is finally built!"