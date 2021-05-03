#include <stdio.h>

#define size 7

int getcount(int arr[]){
    int count = 0;
    while(arr[count] != 1){
        count = count + 1;
        if(count == size){
            return count;
        }
    }
    return count;
}

int * myobj1(){
    static int r[size];
    int i; 
    for(i = 0; i<size; i++){
        r[i] = 1;
    }
    return r;
}

int * myobj2(){
    static int r[size];
    int i; 
    for(i = 0; i<size; i++){
        r[i] = 1;
    }
    return r;
}

void showarr(int arr[]){
    int count  = getcount(arr);
    for(int i = 0; i<count; i++){
        printf("%d ", arr[i]);
    }
}



float avg(int arr[]){
    int count = getcount(arr);
    if(count == 0){
        return 0;
    }
    float sum = 0;
    for(int i = 0; i<count; i++){
        sum += arr[i];
    }
    return (sum/count);
}

void insert(int arr[], int newValue){
    int count = getcount(arr);
    int x;
    if(count == size){
         for(int i = count - 2 ; i>=0; i-- ){
            arr[i+1] = arr[i]; 
        }
    }
    else{
         for(int i = count - 1 ; i>=0; i-- ){
            arr[i+1] = arr[i]; 
        }
    }
    arr[0] = newValue;
}

//int main()
//{
//    int *arr1 = myobj();
//    insert(arr1, -89);
//    insert(arr1, -100);
//    
//    showarr(arr1);
//    printf("Average = %f", avg(arr1));
//
//    return 0;
//}
