document.getElementById('checkBtn').addEventListener('click', () => {
    const followerFile = document.getElementById('followers').files[0];
    const followingFile = document.getElementById('following').files[0];

    if (!followerFile || !followingFile) {
        alert('Harap upload kedua file JSON (followers dan following).');
        return;
    }

    Promise.all([readFile(followerFile), readFile(followingFile)]).then(([followers, following]) => {
        const followerList = extractUsernames(followers);
        const followingList = extractUsernames(following);

        const notFollowingBack = followingList.filter(u => !followerList.includes(u));
        const youDontFollowBack = followerList.filter(u => !followingList.includes(u));

        document.getElementById('result').innerHTML = `
            <h3>Tidak Follback Kamu:</h3>
            <p>${notFollowingBack.join(', ') || 'Tidak ada'}</p>
            <h3>Kamu Tidak Follback:</h3>
            <p>${youDontFollowBack.join(', ') || 'Tidak ada'}</p>
        `;
    }).catch(err => alert('Gagal membaca file: ' + err));
});

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                resolve(JSON.parse(e.target.result));
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

// Fungsi fleksibel untuk ambil username dari berbagai format JSON Instagram
function extractUsernames(json) {
    let usernames = [];

    // Format lama: { relationships_followers: [ { string_list_data: [ { value: "username" } ] } ] }
    if (json.relationships_followers || json.relationships_following) {
        const key = json.relationships_followers ? 'relationships_followers' : 'relationships_following';
        usernames = json[key].map(item => item.string_list_data?.[0]?.value).filter(Boolean);
    }

    // Format baru: langsung array objek dengan { title: "username" } atau { value: "username" }
    else if (Array.isArray(json)) {
        usernames = json.map(item => item.value || item.title || item.string_list_data?.[0]?.value).filter(Boolean);
    }

    return usernames.map(u => u.toLowerCase());
}
