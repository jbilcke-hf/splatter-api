import { exec } from "child_process"

/**
 * Interface for the options for the `runGaussianSplattingCUDA` function.
 */
export interface Options {
  /**
   * Data path for the training data.
   */
  dataPath?: string;
  
  /**
   * If set, forces the overwriting of the output folder. If not set,
   * the program exits if the output folder already exists.
   */
  force?: boolean;
  
  /**
   * Path where the trained model will be saved. If this option isn't specified,
   * the model will be saved to the "output" folder in the root directory of the project.
   */
  outputPath?: string;
  
  /**
   * Specifies the number of iterations to train the model.
   */
  iterations?: number;
  
  /**
   * If set, CUDA memory is emptied every 100 iterations.
   */
  emptyGpuCache?: boolean;
  
  /**
   * If set, the program monitors the average convergence rate throughout training. 
   * When the average convergence rate drops below 0.008 after 15k iterations,
   * optimization stops, which speeds up training when the gain starts to diminish.
   */
  enableCRMonitoring?: boolean;
  
  /**
   * When the `enableCRMonitoring` flag is set, this sets a custom average convergence rate for training.
   */
  convergenceRate?: number;
}

/**
 * Run 3D Gaussian Splatting CUDA Implementation.
 *
 * @param {Options} options - A set of configurations to be passed to the application
 */
export const runGaussianSplattingCUDA = (options: Options): Promise<string> => {
  return new Promise((resolve, reject) => {
    let command = './build/gaussian_splatting_cuda';

    if (options.dataPath) command += ` -d ${options.dataPath}`;
    if (options.force) command += ' -f';
    if (options.outputPath) command += ` -o ${options.outputPath}`;
    if (options.iterations) command += ` -i ${options.iterations}`;
    if (options.emptyGpuCache) command += ' --empty-gpu-cache';
    if (options.enableCRMonitoring) command += ' --enable-cr-monitoring';
    if (options.convergenceRate) command += ` -c ${options.convergenceRate}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};