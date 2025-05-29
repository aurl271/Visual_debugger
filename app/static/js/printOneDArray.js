//max_lenの長さだけヘッダーにインデックスを追加
function renderOneDArrayTableHeader(max_len) {
    const table_head = document.querySelector("#one-d-array-table thead");

    //中身を空に
    table_head.innerHTML = "";

    //一次元配列がないなら空のまま
    if(max_len === 0)return;

    const row = document.createElement("tr");
    
    //変数名のヘッダー
    const variable_name = document.createElement("th");
    variable_name.textContent = "変数名";
    row.appendChild(variable_name);

    //ステップのヘッダー
    const step_value = document.createElement("th");
    step_value.textContent = "ステップ";
    row.appendChild(step_value);

    //インデックスの追加
    for(let i = 0; i < max_len; i++) {
        const value_name = document.createElement("th");
        value_name.textContent = `idx${i}`;
        row.appendChild(value_name);
    }

    //行の追加
    table_head.appendChild(row);
}

//一次元配列の表示
export default function renderOneDArrayTable(start_step,last_step,all_variables) {
    //一番大きいインデックスの取得
    let max_len = 0;
    for (let i = start_step; i < last_step; i++) {
        //変数名(key)の取得
        const obj = all_variables[i]?.["one_d_array"];
        // objが存在するときだけ処理
        if (obj) {
            for (const key in obj) {
                //変数名だけを取り出す objに元々あるものを排除する
                if (Object.hasOwn(obj, key)) {
                    max_len = Math.max(max_len, obj[key].length);
                }
            }
        }
    }

    //ヘッダーの設定
    renderOneDArrayTableHeader(max_len);

    const table_body = document.querySelector("#one-d-array-table tbody");
    //中身をリセット
    table_body.innerHTML = "";

    //ステップ内の一次元配列の変数名の取得
    const union_keys = Array.from(
        new Set(
            all_variables.slice(start_step, last_step).flatMap(dict => dict["one_d_array"] ? Object.keys(dict["one_d_array"]) : [])
        )
    );

    //変数名ごとにループ
    for(let i=0; i < union_keys.length; i++) {
        //ステップごとにループ
        for(let j=start_step; j < last_step; j++) {
            //今のステップに今の一次元配列の変数名がないならパス
            if (all_variables[j]?.["one_d_array"]?.[union_keys[i]] == undefined) {
                continue;
            }

            const row = document.createElement("tr");
            //変数名ごとに色を白とグレーに切り替え
            if (i % 2 === 0) {
                //薄いグレー風
                row.classList.add('table-secondary');
                row.classList.remove('table-light');
            } else {
                //白
                row.classList.add('table-light');
                row.classList.remove('table-secondary');
            }

            //変数名の追加
            const variable_name = document.createElement("td");
            variable_name.textContent = union_keys[i];
            row.appendChild(variable_name);

            //今のステップの追加
            const step_name = document.createElement("td");
            step_name.textContent = j+1;
            row.appendChild(step_name);

            //値を追加
            for(let k=0;k < all_variables[j]["one_d_array"][union_keys[i]].length; k++) {
                const value_cell = document.createElement("td");
                value_cell.textContent = all_variables[j]["one_d_array"][union_keys[i]][k];
                row.appendChild(value_cell);
            }

            //残ったのはN/Aを追加
            for(let k=all_variables[j]["one_d_array"][union_keys[i]].length;k < max_len; k++) {
                const value_cell = document.createElement("td");
                value_cell.textContent = "N/A";
                //N/Aのセルは薄い色にする
                value_cell.style.color = "gray";
                row.appendChild(value_cell);
            }

            //行を追加
            table_body.appendChild(row);
        }
    }
}
