
const migrations = [
    oldData => oldData // v0
];

const migrateDB = (oldVersionCode, currentVersionCode, data) => {
    return new Promise((resolve, reject) => {
        let newData = data;
        for(let version = oldVersionCode; version < currentVersionCode; version++) 
            newData = migrations[version](newData);
        resolve(newData);
    });
};

export default migrateDB;