const axios = require('axios');
require('dotenv').config();

const WORKSPACE_ID = process.env.ORBIT_WORKSPACE_ID;
const ORBIT_API_URL = `https://app.orbit.love/api/v1/${WORKSPACE_ID}/`;
const HEADERS = {
    Authorization: `Bearer ${process.env.ORBIT_API_KEY}`,
}

function getActivity(activityName) {
    listedActivities = {
        "buildSubscription": {
            "activity_type": "buildSubscription",
            "tags": ["subscription"],
            "title": "Build Subscription",
            "description": "Build Subscription",
            "link": "https://bootcamp.web3dev.com.br/",
            "weight": 1,
        }
    }
}

async function createActivity(member, activity) {
    try {
        let response = await axios.post(ORBIT_API_URL + "activities", activity, { headers: HEADERS });
        return response.data.data;
    }
    catch(error) {
        console.error("Error creating activity: ", error);
        return null;
    }
}

async function insertMember(user) {
    let buildMember = formatUserToMember(user);

    try {
        await axios.post(ORBIT_API_URL + "members", buildMember, { headers: HEADERS });
        return true;
    }
    catch (err) {
        console.error("Error inserting member: ", err);
        return false;
    }
}

async function findMemberByEmail(email) {
    try {
        let response = await axios.get(ORBIT_API_URL + "members/find?source=email&email=" + email, { headers: HEADERS });
        return response.data.data;
    }
    catch(error) {
        console.error("Error finding member: ", error);
        return null;
    }
}

async function updateMemberIdentity(user, member_slug, entity_name) {
    try {
        let formatedIdentity = formatIdentity(user, entity_name);
        let response = await axios.post(
            ORBIT_API_URL + `members/${member_slug}/identities`, formatedIdentity, { headers: HEADERS }
        );
        return response.data.data;
    }
    catch(error) {
        console.error("Error updating member identity: ", error);
        return null;
    }
}

function formatIdentity(user, entity_name) {
    let identities = {
        "web3devBuilds": {
            "name": "Web3dev",
            "source": "web3devBuild",
            "source_host": "https://bootcamp.web3dev.com.br/",
            "username": user.username,
            "uid": user.id,
            "email": user.email,
        },
        "forem": {
            "name": "Forem",
            "source": "forem",
            "source_host": "https://web3dev.com.br/",
            "username": user.username,
            "uid": user.id,
            "email": user.email,
        },
    }
    return identities[entity_name];
}

function formatUserToMember(member, entity_name) {
    let identity = formatIdentity(member, entity_name);
    return {
        "member": {
            "name": member.username,
            "email": member.email,
        },
        "identity": {
            identity
        }
    }
}

module.exports = { insertMember, findMemberByEmail, updateMemberIdentity }