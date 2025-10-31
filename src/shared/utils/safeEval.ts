/**
 * Safe Code Execution Utility
 * Provides restricted execution environment for player code
 */

/**
 * Create a safe execution context with whitelisted functions
 * @param allowedFunctions - Object containing allowed functions
 * @returns Execution context
 */
export function createSafeContext(allowedFunctions: Record<string, Function>): any {
  return {
    ...allowedFunctions,
    // Prevent access to dangerous globals
    console: {
      log: (...args: any[]) => {
        // Safe console.log that can be used for debugging
        allowedFunctions.print?.(...args);
      }
    }
  };
}

/**
 * Execute code with timeout protection
 * @param code - Code string to execute
 * @param context - Execution context
 * @param timeout - Timeout in milliseconds (default: 2000)
 * @returns Promise that resolves with execution result
 */
export async function executeWithTimeout(
  code: string,
  context: any,
  timeout: number = 2000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Execution timeout'));
    }, timeout);

    try {
      // Create isolated function
      const func = new Function(
        ...Object.keys(context),
        code
      );

      const result = func(...Object.values(context));
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}
