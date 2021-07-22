// @ts-check

import { exec } from 'node:child_process';

/**
 * Get stdout produced from executing some command.
 * 
 * @param {string} cmd Command to execute
 */
export function getStdOutFrom(cmd) {

  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if(err) {
        reject(`Error executing command: ${cmd} \n ${err} \n ${stderr}`);
      }
      resolve(stdout ? stdout.trim() : '');
    });
  });
}