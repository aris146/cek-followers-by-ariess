document.getElementById("cekBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput");
    const hasilDiv = document.getElementById("hasil");

    if (fileInput.files.length === 0) {
        hasilDiv.innerText = "Pilih file JSON Instagram terlebih dahulu!";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const data = JSON.parse(event.target.result);

            // Ambil followers & following
            let followers = [];
            let following = [];

            if (Array.isArray(data.followers)) {
                followers = data.followers.map(item => item.value || item.username || item.string_list_data?.[0]?.value || item);
            }
            if (Array.isArray(data.following)) {
                following = data.following.map(item => item.value || item.username || item.string_list_data?.[0]?.value || item);
            }

            followers = [...new Set(followers)];
            following = [...new Set(following)];

            const notFollowBack = following.filter(user => !followers.includes(user));

            hasilDiv.innerHTML = `
                <p>Jumlah Followers: <b>${followers.length}</b></p>
                <p>Jumlah Following: <b>${following.length}</b></p>
                <p>Yang tidak follow balik: <b>${notFollowBack.length}</b></p>
                <hr>
                <p>${notFollowBack.join("<br>")}</p>
            `;
        } catch (err) {
            hasilDiv.innerText = "File tidak valid atau format JSON tidak sesuai.";
        }
    };

    reader.readAsText(file);
});
