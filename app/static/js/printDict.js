//ヘッダーのセット
function renderDictTableHeader(start_step,last_step) {
    const table_head = document.querySelector("#dict-table thead");
    //中身のリセット
    table_head.innerHTML = "";

    const row = document.createElement("tr");
    
    //変数名のヘッダー
    const dict_name = document.createElement("th");
    dict_name.textContent = "辞書名";
    row.appendChild(dict_name);

    //keyのヘッダー
    const key_name = document.createElement("th");
    key_name.textContent = "key";
    row.appendChild(key_name);

    //ステップを表示
    for(let i = start_step; i < last_step; i++) {
        const value_name = document.createElement("th");
        value_name.textContent = `ステップ ${i + 1}`;
        row.appendChild(value_name);
    }

    table_head.appendChild(row);
}

//変数を表示するテーブルをセット
export default function renderDictTable(start_step,last_step,all_variables) {    
    //中身のリセット
    const table_body = document.querySelector("#dict-table tbody");
    table_body.innerHTML = "";

    //扱うステップ内の変数名を取得
    const union_keys = Array.from(
        new Set(
            all_variables.slice(start_step, last_step).flatMap(dict => dict["dict"] ? Object.keys(dict["dict"]) : [])
        )
    );

    //変数がないなら表示を消してパス
    if(union_keys.length <= 0){
        document.getElementById("dict-div").style.display = "none";
        document.querySelector("#dict-table thead").innerHTML = "";
        return;
    }else{
        document.getElementById("dict-div").style.display = "block";
    }

    //ヘッダーをセット
    renderDictTableHeader(start_step,last_step);

    //今がどのステップを扱っているかの表示
    const step_row = document.createElement("tr");
    const step_cell = document.createElement("td");
    step_cell.colSpan = (last_step - start_step) + 1;
    step_cell.textContent = `ステップ: ${start_step + 1}～${last_step}`;
    step_cell.style.fontWeight = "bold";
    step_row.appendChild(step_cell);
    table_body.appendChild(step_row);



    //変数名ごとにループ
    for(let i=0; i < union_keys.length; i++) {
        
        //各辞書のキーを取得
        const dict_key = Array.from(
            new Set(
                all_variables.slice(start_step, last_step).flatMap(dict => dict["dict"][union_keys[i]] ? Object.keys(dict["dict"][union_keys[i]]) : [])
            )
        );

        for(let j=0; j < dict_key.length; j++) {
            const row = document.createElement("tr");

            //1列目は辞書名
            const dict_name = document.createElement("td");
            dict_name.textContent = union_keys[i];
            row.appendChild(dict_name);

            const variable_name = document.createElement("td");
            variable_name.textContent = dict_key[j];
            row.appendChild(variable_name);

            //各ステップごとの値を追加(変数名がない場合は"N/A")
            for(let k=start_step; k < last_step; k++) {
                const value_cell = document.createElement("td");
                //値が存在する場合はその値を、存在しない場合は"N/A"を表示
                if (all_variables[k]?.["dict"]?.[union_keys[i]]?.[dict_key[j]] != undefined) {
                    value_cell.textContent = all_variables[k]["dict"][union_keys[i]][dict_key[j]];
                } else {
                    value_cell.textContent = "N/A";
                }
                    row.appendChild(value_cell);
            }

            //行を追加
            table_body.appendChild(row);
        }        
    }
}