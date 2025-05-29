from flask import Flask, render_template, Blueprint, request, session, redirect, url_for
import json
import io
import sys
import ast

app = Blueprint('app', __name__)

debug_code = '''
def __get_dimension(array):
    if not isinstance(array, list):
        return 0
    if not array:
        # 空リストは0次元とみなす
        return 0
    return 1 + __get_dimension(array[0])

def debug(**kwargs):
    for name,value in kwargs.items():
        if isinstance(value, (int, str, float)):
            print(f"variables {name} {value}")
        elif isinstance(value, (list)):
            if __get_dimension(value) == 1:
                print(f"one_d_array {name} {value}")
            elif __get_dimension(value) > 1:
                print(f"n_d_array {name} {value}")
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
        error_message = None
        try:
            try:
                exec(debug_code + "\n" + code, local_vars, local_vars)
                exec_output = mystdout.getvalue()
                # debugの結果を取得
                all_variables = []
                step_variables = {}
                for line in exec_output.splitlines():
                    if(line == "###debug_end"):
                        all_variables.append(step_variables)
                        step_variables = {}
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
            except Exception as e:
                error_message = str(e)
                all_variables = None
        finally:
            sys.stdout = old_stdout

        return render_template(
            "home.html",
            code=code,
            input_data=input_data,
            all_variables=all_variables,
            all_variables_json= json.dumps(all_variables if all_variables is not None else []),
            error_message=error_message
        )