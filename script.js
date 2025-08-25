document.getElementById('cekBtn').addEventListener('click', () => {
    const followersFile = document.getElementById('followersFile').files[0];
    const followingFile = document.getElementById('followingFile').files[0];

    if (!followersFile || !followingFile) {
        alert('Pilih kedua file (followers.json dan following.json) terlebih dahulu!');
        return;
    }

    Promise.all([followersFile.text(), followingFile.text()])
        .then(([followersText, followingText]) => {
            try {
                const followersData = JSON.parse(followersText);
                const followingData = JSON.parse(followingText);

                // Ambil username dari followers
                const followersList = followersData.map(item => 
                    item.value || (item.string_list_data && item.string_list_data[0].value)
                );

                // Ambil username dari following
                const followingList = followingData.map(item => 
                    item.value || (item.string_list_data && item.string_list_data[0].value)
                );

                // Cari akun yang tidak follback
                const followersSet = new Set(followersList);
                const notFollowingBack = followingList.filter(user => !followersSet.has(user));

                const hasilDiv = document.getElementById('hasil');
                if (notFollowingBack.length === 0) {
                    hasilDiv.innerHTML = "<b>Semua mengikuti kamu balik.</b>";
                } else {
                    hasilDiv.innerHTML = "<b>Tidak follback:</b><br>" + notFollowingBack.join("<br>");
                }
            } catch (err) {
                alert('Format file salah atau tidak dapat dibaca.');
            }
        })
        .catch(() => alert('Terjadi kesalahan saat membaca file.'));
});
