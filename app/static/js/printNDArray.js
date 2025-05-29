export default class printNDArray{

    //今選択している変数名
    #_variable_name = "";
    //変数の次元
    #_n_d_array_dimension = 0;
    //縦軸の次元
    #_vertical_axis_dimension = 0;
    //横軸の次元
    #_horizontal_axis_dimension = 0;
    //縦軸、横軸以外でそれぞれの次元で固定されるインデックス
    #_fixed_dimension_index = [];
    //startstepを取得
    #_getStartStep;
    //laststepを取得
    #_getLastStep;
    //allvariablesを取得
    #_getAllVariables;

    constructor(getStartStep,getLastStep,getAllVariables){
        //startstepとかを取得できるように
        this.#_getStartStep = getStartStep;
        this.#_getLastStep = getLastStep;
        this.#_getAllVariables = getAllVariables;

        const n_d_array_select = document.getElementById("n-d-array-select");
        const vertical_axis = document.getElementById("vertical-axis");
        const horizontal_axis = document.getElementById("horizontal-axis");

        n_d_array_select.addEventListener("change", (event) => {
            this.#changeVariableName(this.#_getStartStep(),this.#_getLastStep(),event.target.value,this.#_getAllVariables());
        });
        vertical_axis.addEventListener("change", (event) => {
            this.#changeVerticalAxis(this.#_getStartStep(),this.#_getLastStep(),Number(event.target.value),this.#_getAllVariables());
        });
        horizontal_axis.addEventListener("change", (event) => {
            this.#changeHorizontalAxis(this.#_getStartStep(),this.#_getLastStep(),Number(event.target.value),this.#_getAllVariables());
        });
    }

    //n_d_arrayの次元を取得
    //再帰関数
    #getDimension(n_d_array) {
        if(Array.isArray(n_d_array)){
            return this.#getDimension(n_d_array[0])+1;
        }else{
            return 0;
        }
    }

    //n_d_arrayのindex次元の長さを取得
    //再帰関数
    #getDimensionLength(n_d_array,index) {
        if(index === 0)return n_d_array.length;
        else{
            return this.#getDimensionLength(n_d_array[0],index-1);
        }
    }

    //n_d_arrayを転置
    //n_d_array[0].map((_, colIndex)でcolIndexが0～列数になる
    //n_d_array.map(row で各行を取得し、row[colIndex]で列の要素を取得
    #transpose(n_d_array) {
        return n_d_array[0].map((_, colIndex) => n_d_array.map(row => row[colIndex]));
    }

    //特定の次元を固定することでN次元配列を2次元配列に変換
    //arrayにN次元配列,vertical_dimensionに縦軸の次元,horizontal_dimensionに横軸の次元,current_dimensionに今の次元,array_dimensionにarrayの次元を格納
    //再帰関数
    #getNDto2DArray(array, vertical_dimension, horizontal_dimension, fixed_dimension,current_dimension,array_dimension){
        //縦軸の次元と横軸の次元が一致していれば2次元配列は作れないのでnullを返す
        if(vertical_dimension === horizontal_dimension) return null;
        //今の次元が固定される次元かつ最後の次元じゃないなら再帰で潜る
        if(current_dimension !== vertical_dimension && current_dimension !== horizontal_dimension && current_dimension < array_dimension-1)return this.#getNDto2DArray(array[fixed_dimension[current_dimension]],vertical_dimension,horizontal_dimension,fixed_dimension,current_dimension+1,array_dimension);
        //今の次元が固定される次元かつ最後の次元なら値を返す
        if(current_dimension !== vertical_dimension && current_dimension !== horizontal_dimension && current_dimension === array_dimension-1)return array[fixed_dimension[current_dimension]];
        
        //最終的に2次元になる配列
        //ここに来るのはvertical_dimension or horizontal_dimensionnの2回来る
        //深い方は一次元配列になり、浅い方は返したい2次元配列になる。
        let two_d_array = [];

        //上記のif文で今の次元は固定された次元でない(縦軸or横軸の次元)
        //固定された次元でないのでループ
        for(let i=0;i < array.length;i++){
            //最後の次元じゃないなら今の次元をiにした場合の配列or値をtwo_d_arrayに追加
            if(current_dimension !== array_dimension - 1)two_d_array.push(this.#getNDto2DArray(array[i],vertical_dimension,horizontal_dimension,fixed_dimension,current_dimension+1,array_dimension));
            //最後の次元なら今の次元をiにした値をtwo_d_arrayに追加
            else if(current_dimension === array_dimension - 1)two_d_array.push(array[i]);
        }

        //vertical_dimensionとhorizontal_dimensionの小さい方から上記のfor文を行い、two_d_arrayを作るので、
        //縦軸の次元がvertical_dimensionとhorizontal_dimensionの小さい方
        //横軸の次元がvertical_dimensionとhorizontal_dimensionの大きい方
        //になるので、vertical_dimension > horizontal_dimensionになり、two_d_arrayが2次元になっているときに転置
        if(vertical_dimension > horizontal_dimension && this.#getDimension(two_d_array) === 2){
            two_d_array = this.#transpose(two_d_array)
        }

        //two_d_arrayを返す
        return two_d_array;
    }


    //セレクト欄の次元欄だけをセット
    #selectDimensionSet(start_step,last_step,variable_name,all_variables){
        //セレクトの取得
        const vertical_axis = document.getElementById("vertical-axis");
        const horizontal_axis = document.getElementById("horizontal-axis");
        const fixed_dimension_container = document.getElementById("fixed-dimension-container");

        //中身のリセット
        vertical_axis.innerHTML = "";
        horizontal_axis.innerHTML = "";
        fixed_dimension_container.innerHTML = "";

        let exist_step = -1;
        for(let i=start_step;i < last_step;i++){
            if(all_variables[i]?.["n_d_array"]?.[variable_name] != undefined){
                exist_step = i;
                break;
            }
        }
        
        if(exist_step === -1)return;
    
        //次元数の取得
        this.#_n_d_array_dimension = this.#getDimension(all_variables[exist_step]["n_d_array"][variable_name]);

        //2次元以下ならセレクトを無効
        if(this.#_n_d_array_dimension < 2){
            vertical_axis.disabled = true;
            horizontal_axis.disabled = true;
            return;
        }

        //次元ごとにループ
        for(let i=0; i < this.#_n_d_array_dimension; i++) {
            //i次元目のオプションの追加
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `次元${i+1}`;
            vertical_axis.appendChild(option);
            horizontal_axis.appendChild(option.cloneNode(true));

            //2次元より大きいなら縦と横以外の次元を固定しないと2次元配列にならないので、
            //次元のインデックスを固定するセレクトの作成
            if(this.#_n_d_array_dimension > 2){
                //セレクトの設定
                const select = document.createElement("select");
                select.className = "form-select";
                select.style.width = "auto";
                //固有のidを持たせる
                select.id = `fixed-dimension-${i}`;
                //各次元ごとの最大のインデックスを取得
                const dimension_length = this.#getDimensionLength(all_variables[exist_step]["n_d_array"][variable_name],i);
                //各インデックスのオプションを追加
                for(let j=0; j < dimension_length; j++) {
                    const option = document.createElement("option");
                    option.value = j;
                    option.textContent = `次元${i+1}idx${j}`;
                    select.appendChild(option);
                }
                select.addEventListener("change",(event) =>{
                    this.#changeFixedValue(this.#_getStartStep(),this.#_getLastStep(),Number(event.target.id.split("-")[2]),Number(event.target.value),this.#_getAllVariables());
                });
                //コンテナにセレクトを追加
                fixed_dimension_container.appendChild(select);
            }
        }

        //セレクトを初期設定
        vertical_axis.value = 0;
        horizontal_axis.value = 1;

        //フィールドを設定
        this.#_vertical_axis_dimension = Number(vertical_axis.value);
        this.#_horizontal_axis_dimension = Number(horizontal_axis.value);

        //固定されたインデックスを設定
        this.#_fixed_dimension_index = [];
        for(let j=0; j < this.#_n_d_array_dimension; j++) {
            this.#_fixed_dimension_index.push(0);
        }
        
        //次元が2より大きい場合は次元のインデックスを固定するセレクトがあり、横縦軸に設定されている次元のセレクトを無効化
        if(this.#_n_d_array_dimension > 2){
            document.getElementById(`fixed-dimension-${this.#_vertical_axis_dimension}`).disabled = true;
            document.getElementById(`fixed-dimension-${this.#_horizontal_axis_dimension}`).disabled = true;
        }

        //ここまで問題ないならセレクトをアクティブにする
        vertical_axis.disabled = false;
        horizontal_axis.disabled = false;
    }

    //セレクト(変数、次元の選択)のすべてのセット
    selectAllSet(start_step,last_step,all_variables){
        //セレクトの取得
        const n_d_array_select = document.getElementById("n-d-array-select");
        const vertical_axis = document.getElementById("vertical-axis");
        const horizontal_axis = document.getElementById("horizontal-axis");
        const fixed_dimension_container = document.getElementById("fixed-dimension-container");

        //すべての空に
        n_d_array_select.innerHTML = "";
        vertical_axis.innerHTML = "";
        horizontal_axis.innerHTML = "";
        fixed_dimension_container.innerHTML = "";
        
        //扱うステップ内の変数名を取得
        const union_keys = Array.from(
            new Set(
                all_variables.slice(start_step, last_step).flatMap(dict => dict["n_d_array"] ? Object.keys(dict["n_d_array"]) : [])
            )
        );
        
        //変数がないならセレクトを無効化
        if(union_keys.length < 1){
            n_d_array_select.disabled = true;
            vertical_axis.disabled = true;
            horizontal_axis.disabled = true;
            return;
        }

        
        //変数名のオプションの追加
        for(let i=0; i < union_keys.length; i++) {
            const option = document.createElement("option");
            option.value = union_keys[i];
            option.textContent = `変数名:${union_keys[i]}`;
            n_d_array_select.appendChild(option);
        }
        //とりあえず一番最初の変数名をセット
        this.#_variable_name = union_keys[0];
        n_d_array_select.value = this.#_variable_name;
        n_d_array_select.disabled = false;

        //セレクト欄の次元欄もセット
       this.#selectDimensionSet(start_step,last_step,this.#_variable_name,all_variables);
    }

    //縦軸の次元をセット
    #changeVerticalAxis(start_step,last_step,new_vertical_axis_dimension,all_variables){
        //横軸が縦軸と一致してないなら古い縦軸は使えるようにする
        if(this.#_vertical_axis_dimension !== this.#_horizontal_axis_dimension && this.#_n_d_array_dimension > 2)document.getElementById(`fixed-dimension-${this.#_vertical_axis_dimension}`).disabled = false;
        //新しい次元のセレクトは使えなくする
        if(this.#_n_d_array_dimension > 2)document.getElementById(`fixed-dimension-${new_vertical_axis_dimension}`).disabled = true;
        //フィールドの更新
        this.#_vertical_axis_dimension = new_vertical_axis_dimension;

        this.renderNDArray(start_step,last_step,all_variables,this.#_variable_name,this.#_vertical_axis_dimension,this.#_horizontal_axis_dimension,this.#_fixed_dimension_index);
    }

    //横軸の次元をセット
    #changeHorizontalAxis(start_step,last_step,new_horizontal_axis_dimension,all_variables){
        //縦軸が横軸と一致してないなら古い横軸は使えるようにする
        if(this.#_horizontal_axis_dimension !== this.#_vertical_axis_dimension && this.#_n_d_array_dimension > 2)document.getElementById(`fixed-dimension-${this.#_horizontal_axis_dimension}`).disabled = false;
        //新しい次元のセレクトは使えなくする
        if(this.#_n_d_array_dimension > 2)document.getElementById(`fixed-dimension-${new_horizontal_axis_dimension}`).disabled = true;
        //フィールドの更新
        this.#_horizontal_axis_dimension = new_horizontal_axis_dimension;
        this.renderNDArray(start_step,last_step,all_variables,this.#_variable_name,this.#_vertical_axis_dimension,this.#_horizontal_axis_dimension,this.#_fixed_dimension_index);
    }

    //固定された次元の値を変更
    #changeFixedValue(start_step,last_step,fixed_dimension,fixed_dimension_value,all_variables){
        const select = document.getElementById(`fixed-dimension-${fixed_dimension}`);  // selectのidを指定
        const option_values = Array.from(select.options).map(option => Number(option.value));
        if(0 <= fixed_dimension && fixed_dimension < this.#_fixed_dimension_index.length
        && option_values.includes(fixed_dimension_value)
        ){
            this.#_fixed_dimension_index[fixed_dimension] = fixed_dimension_value;
            this.renderNDArray(start_step,last_step,all_variables,this.#_variable_name,this.#_vertical_axis_dimension,this.#_horizontal_axis_dimension,this.#_fixed_dimension_index);
        }
    }

    //変数の指定
    #changeVariableName(start_step,last_step,new_variable_name,all_variables){
        this.#_variable_name = new_variable_name;
        this.#selectDimensionSet(start_step,last_step,this.#_variable_name,all_variables);
        this.renderNDArray(start_step,last_step,all_variables,this.#_variable_name,this.#_vertical_axis_dimension,this.#_horizontal_axis_dimension,this.#_fixed_dimension_index);
    }

    //テーブルのヘッダを設定
    #renderNDArrayTableHeader(max_len,vertical_dimension, horizontal_dimension){

        //テーブルのヘッダのリセット
        const table_head = document.querySelector("#n-d-array-table thead");
        table_head.innerHTML = "";

        //vertical_dimension === horizontal_dimensionなら2次元配列が作れないので何もしないで終わり
        if(vertical_dimension === horizontal_dimension) return;

        const row = document.createElement("tr");

        //左上の何もないところ
        const variable_name = document.createElement("th");
        variable_name.textContent = "";
        row.appendChild(variable_name);

        //次元とインデックスを追加
        for(let i = 0; i < max_len; i++) {
            const value_name = document.createElement("th");
            value_name.textContent = `${horizontal_dimension}:idx${i}`;
            row.appendChild(value_name);
        }

        //ヘッダに追加
        table_head.appendChild(row);
    }

    //N次元配列を2次元配列として表示する
    renderNDArray(start_step,last_step,all_variables,variable_name = undefined, vertical_dimension = undefined, horizontal_dimension = undefined, fixed_dimension = undefined){
        variable_name ??= this.#_variable_name;
        vertical_dimension ??= this.#_vertical_axis_dimension;
        horizontal_dimension ??= this.#_horizontal_axis_dimension;
        fixed_dimension ??= this.#_fixed_dimension_index;
        
        //テーブルを空に
        const table_body = document.querySelector("#n-d-array-table tbody");
        table_body.innerHTML = "";
        
        let is_exist = false;
        //該当する変数がないまたは横軸と縦軸が一致している場合はパス
        for(let i=start_step;i<last_step;i++){
            if(all_variables[i]?.["n_d_array"]?.[variable_name] != undefined){
                is_exist = true;
                break;
            }
        }

        if(vertical_dimension === horizontal_dimension && !is_exist){
            this.#renderNDArrayTableHeader(0,vertical_dimension,horizontal_dimension);
            return;
        }
        
        //ステップごとの2次元配列の配列
        let two_d_arrays = [];
        //縦と横の長さ
        let H = 0, W = 0;

        //ステップでループ
        //変数名があるなら指定した次元の2次元配列をtwo_d_arraysに追加、なければ-1を追加
        for(let i=start_step;i<last_step;i++){
            if(all_variables[i]?.["n_d_array"]?.[variable_name] == undefined){
                two_d_arrays.push(-1);
            }else{
                let two_d_array = this.#getNDto2DArray(all_variables[i]["n_d_array"][variable_name],vertical_dimension,horizontal_dimension,fixed_dimension,0,this.#getDimension(all_variables[i]["n_d_array"][variable_name]));
                two_d_arrays.push(two_d_array);
                H = two_d_array.length;
                W = two_d_array[0].length; 
            }
        }
        
        //-1のところを"N/A"の2次元配列に
        for(let i=0;i<last_step-start_step;i++){
            if(two_d_arrays[i] === -1){
                let tmp_two_d_array = [];
                for(let j = 0;j<H;j++){
                    let tmp_array = [];
                    for(let k = 0;k<W;k++)tmp_array.push("N/A");
                    tmp_two_d_array.push(tmp_array);
                }
                two_d_arrays[i] = tmp_two_d_array;
            }
        }
        
        //ヘッダーの設定
        this.#renderNDArrayTableHeader(W,vertical_dimension,horizontal_dimension);

        //実際に表示するテーブル
        let table_two_d_array = []
        for(let i = 0;i<H;i++){
            let tmp_two_d_array = [];
            for(let j = 0;j < W;j++){
                //矢印で値を結合
                let tmp_str = String(two_d_arrays[0][i][j]);
                for(let k = 1;k < last_step-start_step;k++){
                    tmp_str = tmp_str + "->" + String(two_d_arrays[k][i][j]);
                }
                tmp_two_d_array.push(tmp_str);
            }
            table_two_d_array.push(tmp_two_d_array);
        }

        //表を制作
        for(let i = 0;i<H;i++){
            const row = document.createElement("tr");
            //最初はインデックスの追加
            const idx_name = document.createElement("td");
            idx_name.textContent = `${vertical_dimension}:idx${i}`;
            row.appendChild(idx_name);

            //値の追加
            for(let j = 0;j<W;j++){
                const value_cell = document.createElement("th");
                value_cell.textContent = table_two_d_array[i][j];
                row.appendChild(value_cell);
            }
            table_body.appendChild(row);
        }
    }
}
