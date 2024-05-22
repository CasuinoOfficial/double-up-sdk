// Function to sleep for a specified duration
export const sleep = (ms: number): any => (
    new Promise(resolve => setTimeout(resolve, ms))
);

export const extractGenericTypes = (typeName: string): string[] => {
    const x = typeName.split("<");
    if (x.length > 1) {
      return x[1].replace(">", "").replace(" ", "").split(",");
    } else {
      return [];
    };
};
