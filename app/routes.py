from flask import Flask, render_template, Blueprint, request, session, redirect, url_for
import json
import io
import sys
import ast
import os

#run.pyから実行するとsys.path(importする先)にappが含まれていないので、from atcoder.segtree import SegTreeができない
#よって自分の存在するディレクトリの絶対パスを追加
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = Blueprint('app', __name__)

debug_code = '''
from atcoder.segtree import SegTree

def __get_dimension(array):
    if not isinstance(array, list):
        return 0
    if not array:
        # 空リストは0次元とみなす
        return 0
    return 1 + __get_dimension(array[0])

def debug(**kwargs):
    print("###debug_start")
    for name,value in kwargs.items():
        if isinstance(value, (int, str, float)):
            print(f"variables {name} {value}")
        elif isinstance(value, (list,)):
            if __get_dimension(value) == 1:
                print(f"one_d_array {name} {value}")
            elif __get_dimension(value) > 1:
                print(f"n_d_array {name} {value}")
        elif isinstance(value, (SegTree,)):
            print(f"segtree {name} {value.get_segtree()}")
    print("###debug_end")
'''

def str_to_number(s):
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return s  # 数値でなければそのまま返す
            
@app.route("/",methods=['GET','POST'])
def home():
    if request.method == 'GET':
        return render_template(
            "home.html",
            code=None, 
            input_data = None, 
            all_variables=None,
            all_variables_json=None,
            error_message = None)
    
    elif request.method == 'POST':
        code = request.form['code-input']
        input_data = request.form['input-data']
        
        old_stdout = sys.stdout
        sys.stdout = mystdout = io.StringIO()
        local_vars = {}
        input_lines = input_data.splitlines()
        input_iter = iter(input_lines)
        local_vars['input'] = lambda: next(input_iter)
        local_vars['__file__'] = os.path.abspath(__file__)
        error_message = None
        try:
            try:
                exec(debug_code + "\n" + code, local_vars, local_vars)
                exec_output = mystdout.getvalue()
                sys.stdout = old_stdout
                print(exec_output)
                # debugの結果を取得
                all_variables = []
                step_variables = {}
                is_debug = False
                for line in exec_output.splitlines():
                    if(line == "###debug_start"):
                        is_debug = True
                    elif(line == "###debug_end"):
                        all_variables.append(step_variables)
                        step_variables = {}
                        is_debug = False
                        continue
                    parts = line.split(maxsplit=2)
                    if len(parts) != 3:
                        continue
                    type_name, var_name, value_str = parts
                    if type_name == "variables":
                        step_variables.setdefault(type_name, {})[var_name] = str_to_number(value_str)
                    elif type_name == "one_d_array":
                        step_variables.setdefault(type_name, {})[var_name] = ast.literal_eval(value_str)
                    elif type_name == "n_d_array":
                        step_variables.setdefault(type_name, {})[var_name] = ast.literal_eval(value_str)
                    elif type_name == "segtree":
                        step_variables.setdefault(type_name, {})[var_name] = ast.literal_eval(value_str)
            except Exception as e:
                error_message = str(e)
                error_message = "エラー発生:" + error_message
                all_variables = None
        finally:
            sys.stdout = old_stdout
            
        
        #all_variables = [{"segtree":{"segtree1":[1,10,3,7,1,2,3,4],"segtree2":[1,26,11,15,5,6,7,8]} } ,
        #                 {"segtree":{"segtree2":[1,58,27,31,13,14,15,16]}} ,
        #                 {"segtree":{"segtree1":[1,10,7,3,4,3,2,1]}}]

        return render_template(
            "home.html",
            code=code,
            input_data=input_data,
            all_variables=all_variables,
            all_variables_json= json.dumps(all_variables if all_variables is not None else []),
            error_message=error_message
        )