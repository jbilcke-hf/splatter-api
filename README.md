---
title: Gaussian Splatting API
emoji: 🎨
colorFrom: green
colorTo: yellow
sdk: docker
pinned: true
app_port: 7860
---

## Presentation

### What is this project?

Gaussian Splatting API is a REST API to generate 3D Gaussian Splatting scenes from a set of images.

It is a wrapper around [MrNERF/gaussian-splatting-cuda](https://github.com/MrNeRF/gaussian-splatting-cuda).

### License

The server wrapping code is open-source, but the code engine [gaussian-splatting-cuda](https://github.com/MrNeRF/gaussian-splatting-cuda) is based on [project by the Inria and the Max Planck Institut for Informatik (MPII)](https://github.com/graphdeco-inria/gaussian-splatting).

This is a [publicly funded project](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/) with a [non-commercial license](GAUSSIAN-SPLATTING-LICENCE.md).

### So I can't use it for commercial apps?

You will have to talk with the original rightholders at the INRIA and MPII.

Also, please tell if you know about any alternative project with a fully permissive open-source licensing.

## Running on your machine

### Prerequisites

You need a machine with CUDA, a GPU etc

### Environment variables

- `STORAGE_PATH`: on HF use `/data`, on a local you can use `.sandbox/`

### Deployment to Hugging Face

This can take some time.

note: this is a long build (~30 min)

