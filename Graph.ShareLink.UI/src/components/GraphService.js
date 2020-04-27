import data from '../input/data';

var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
    const client = graph.Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}

export async function getUserDetails(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = client.api('/me').get();
    return user;
}

export async function getDriveItems(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const items = await client.api('/me/drive/root/children').get();
    return items;
}

export async function getDriveItemsFromData(accessToken) {
    const client = getAuthenticatedClient(accessToken);
    let items = [];
    for (let item of data) {
        let _item = await client.api('me/drive/root:' + item.path +'?$select=id,weburl,folder,name').get();
        items.push({ ..._item, sharedWith: item.sharedwith, permission: item.permission });
    };
    return items;
}

export async function postShareItem(item, accessToken) {
    const client = getAuthenticatedClient(accessToken);
    if (client) {
        const emails = item.shared.map((item) => { return { "email": item.email } });
        const message = {
            recipients: emails,
            message: "Please find this files shared on the OneDrive",
            requireSignIn: true,
            sendInvitation: true,
            roles: [item.permission]
        };

        const res = await client.api(`me/drive/items/${item.id}/invite`).post(message);
        const responseStatus = (res && res.value && res.value.length > 0) ? 'Success' : 'Error';
        return responseStatus;
    }    
}