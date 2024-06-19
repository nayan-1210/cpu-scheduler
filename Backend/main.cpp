#include <bits/stdc++.h>
#include "parse.hpp"
#include "algorithm.cpp"

using namespace std;

vector<vector<pair<int,int>>> schedule(string algorithm_name){
    if(algorithm_name=="FCFS"){
        return(FirstComeFirstServe());
    }
    else if(algorithm_name=="RR"){
        return(RoundRobin(4));
    }
    else if(algorithm_name=="SJF"){
        return(ShortestJobFirst());
    }
    else if(algorithm_name=="SRTF"){
        return(ShortestRemainingTimeFirst());
    }
    
}


int main(){
    cout<<"Yes"<<endl;
    parse_input();
    ofstream outputFile("output.txt");
    for(int i=0;i<4;i++){
        vector<vector<pair<int,int>>> result=schedule(algorithms[i]);
        for(int i=0;i<result.size();i++){
            for(auto p:result[i]){
                outputFile<<p.first<<":"<<p.second<<",";
            }
            outputFile<<endl;
        }
        outputFile<<endl;
    }
    outputFile.close();
    cout<<"helloooo"<<endl;
    return 0;
}