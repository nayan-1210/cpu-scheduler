#include<bits/stdc++.h>
using namespace std;

int process_count;
int final_time;
vector<vector<int>> process;

string line;

vector<vector<pair<int,int>>> result;

vector<int> split_process(string process_string){
    int pid=process_string[0]-'A';
    pid++;
    process_string=process_string.substr(2,process_string.length()-2);
    int pat,pbt;
    int i=0;
    string str="";
    while(i<process_string.length()){
        if(process_string[i]!=',') str+=process_string[i];
        else{
            pat=stoi(str);
            str="";
        }
        i++;
    }
    pbt=stoi(str);
    return {pid,pat,pbt};

}

void parse_process() {
  string process_string;
  ifstream inputFile("received_file.txt");
  int count=0;

  while(getline(inputFile,line)){
    if(line=="") continue;
    if(count==0){
        count++;
        continue;
    }
    process_string=line;
    cout<<process_string<<endl;
    vector<int> process_det=split_process(process_string);
    process.push_back(process_det);
    
    
    
  }
  vector<int> arrival_time;
  for(auto i:process) arrival_time.push_back(i[1]);
    ofstream outFile("arrival.txt");
    for(auto i:arrival_time) outFile<<i<<endl;
    outFile.close();
}

void calculatefinaltime(){
    int finaltime=0;
    int sumbursttime=0;
    int minarrivaltime=1000;
    for(int i=0;i<process.size();i++){
        sumbursttime+=process[i][2];
    }
    for(int i=0;i<process.size();i++){
        finaltime=max(finaltime,process[i][1]+process[i][2]);
        minarrivaltime=min(minarrivaltime,process[i][1]);
    }
    finaltime=max(finaltime,minarrivaltime+sumbursttime);
    final_time=finaltime;
}

void parse_input(){

    ifstream inputFile("received_file.txt");
    int count=0;
    while (getline(inputFile, line)){
        if(line=="") continue;
        cout<<line<<endl;
        if(count==0){
            process_count=stoi(line);
            count++;
        }
        
        
    }
    cout<<"hello"<<endl;
    parse_process();
    calculatefinaltime();
}