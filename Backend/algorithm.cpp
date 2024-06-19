#include <bits/stdc++.h>
using namespace std;

vector<string> algorithms={"FCFS","SJF","SRTF","RR"};
// FCFS - First Come First Serve
// RR - Round Robin
// SJF - Shortest Job First
// SRTF - Shortest Remaining Time First
// AGING - Priority Scheduling with Aging

vector<vector<int>> sortByArrivalTime(vector<vector<int>> processes){
    sort(processes.begin(), processes.end(),[](const vector<int>& a, const vector<int>& b) {return a[1] < b[1];});
    return processes;
}

vector<vector<pair<int,int>>> FirstComeFirstServe(){
    cout<<"fcfs"<<endl;
    vector<vector<int>> process_sorted_by_arrival_time=sortByArrivalTime(process);
    vector<vector<pair<int,int>>> result;
    vector<pair<int,vector<pair<int,int>>>> temp;
    int time=process_sorted_by_arrival_time[0][1];
    for(int i=0;i<process_count;i++){
        int arrival_time=process_sorted_by_arrival_time[i][1];
        int burst_time=process_sorted_by_arrival_time[i][2];
        int finish_time=time+burst_time;
        
        temp.push_back({process_sorted_by_arrival_time[i][0],{{time,finish_time}}});
        time+=burst_time;
    }
    sort(temp.begin(),temp.end());
    for(auto p:temp) result.push_back(p.second);
    return result;
    // for(int i=0;i<process_count;i++){
    //     cout<<process_sorted_by_arrival_time[i][0]<<" "<<process_sorted_by_arrival_time[i][1]<<" "<<process_sorted_by_arrival_time[i][2]<<endl;
    // }

}


vector<vector<pair<int,int>>> ShortestJobFirst(){
    cout<<"sjf"<<endl;
    vector<vector<int>> process_sorted_by_arrival_time=sortByArrivalTime(process);
    vector<vector<pair<int,int>>> result;
    vector<pair<int,vector<pair<int,int>>>> temp;
    
    priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int, int>>> pq;
    for(int i=0;i<process_count;i++){
        pq.push({process[i][2],process[i][0]});
    }
    
    int time=process_sorted_by_arrival_time[0][1];
    while(time<final_time){
        vector<pair<int,int>> sjf;
        bool process_executed=false;
        while(!pq.empty()){
            int pid=pq.top().second;
            int arrival_time=process[pid-1][1];
            int burst_time=pq.top().first;
            if(time<arrival_time){
                sjf.push_back({burst_time,pid});
                pq.pop();
            }
            else{
                process_executed=true;
                int finish_time=time+burst_time;
                temp.push_back({pid,{{time,finish_time}}});
                time+=burst_time;
                pq.pop();
                break;
            }
        }
        for(auto proc: sjf) pq.push(proc);
        if(!process_executed) time++;
    }
    sort(temp.begin(),temp.end());
    for(auto p:temp) result.push_back(p.second);
    return result;
}

vector<vector<pair<int,int>>> ShortestRemainingTimeFirst(){
    cout<<"srtf"<<endl;
    vector<vector<int>> process_sorted_by_arrival_time=sortByArrivalTime(process);
    vector<vector<pair<int,int>>> result(process_count,vector<pair<int,int>>());
    vector<pair<int,vector<pair<int,int>>>> temp;
    
    priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int, int>>> pq;
    for(int i=0;i<process_count;i++){
        pq.push({process[i][2],process[i][0]});
    }

    int time=process_sorted_by_arrival_time[0][1];
    while(time<final_time){
        vector<pair<int,int>> srtf;
        bool process_executed=false;
        while(!pq.empty()){
            int pid=pq.top().second;
            int arrival_time=process[pid-1][1];
            int service_time_left=pq.top().first;

            if(time<arrival_time){
                srtf.push_back({service_time_left,pid});
                pq.pop();
            }
            else{
                process_executed=true;
                int finish_time=time+1;
                service_time_left--;
                if(service_time_left!=0){
                    srtf.push_back({service_time_left,pid});
                }
                
                result[pid-1].push_back({time,time+1});
                time++;
                pq.pop();
                break;
            }

        }
        for(auto proc: srtf) pq.push(proc);
        if(!process_executed) time++;
    }
    vector<vector<pair<int,int>>> srtf_result(process_count,vector<pair<int,int>>());
    for(int i=0;i<process_count;i++){
        vector<pair<int,int>> res=result[i];
        int st_time=res[0].first;
        int fin_time=res[0].second;
        for(int j=0;j<res.size()-1;j++){
            if(res[j].second==res[j+1].first){
                fin_time=res[j+1].second;
            }
            else{
                srtf_result[i].push_back({st_time,fin_time});
                st_time=res[j+1].first;
                fin_time=res[j+1].second;
            }
        }
        srtf_result[i].push_back({st_time,fin_time});
    }
    return srtf_result;
}


vector<vector<pair<int,int>>> RoundRobin(int quantum){
    cout<<"rr"<<endl;
    vector<vector<int>> process_sorted_by_arrival_time=sortByArrivalTime(process);
    vector<vector<pair<int,int>>> result(process_count,vector<pair<int,int>>());
    vector<vector<int>> processes=process;
    int time=process_sorted_by_arrival_time[0][1];
    int remaining_process=process_count;

    int pid=0;
    while(remaining_process>0){
        int arrival_time=processes[pid][1];
        int service_time_left=processes[pid][2];
        if(service_time_left==0 || time<arrival_time){
            pid++;
            pid%=process_count;
            continue;
        }
        if(service_time_left<=quantum){
            processes[pid][2]=0;
            remaining_process--;
            result[pid].push_back({time,time+service_time_left});
            time+=service_time_left;
            pid++;
            pid%=process_count;
        }
        else{
            processes[pid][2]=service_time_left-quantum;
            result[pid].push_back({time,time+quantum});
            time+=quantum;
            pid++;
            pid%=process_count;
        }
        
    }
    return result;
}

