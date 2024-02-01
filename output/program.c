#include <stdio.h>
typedef char literal[256];
void main(void){
/*----Variaveis temporarias----*/
	int T0;
	int T1;
	int T2;
	int T3;
	int T4;
	int T5;
	int T6;
	int T7;
	int T8;
	int T9;
	int T10;
	int T11;
/*------------------------------*/
	literal K;
	literal A;
	literal G;
	int E;
	int B;
	int D;
	double C;

	printf("Digite B: ");
	scanf("%d", &B);
	printf("Digite A: ");
	scanf("%s", A);
	T0=B>2;
	if(T0){
		T1=B<=4;
		if(T1){
			printf("B esta entre 2 e 4");
		}
	}
	T2=B+1;
	B=T2;
	T3=B+2;
	B=T3;
	T4=B+3;
	B=T4;
	D=B;
	C=5.0;
	printf("\nB=\n");
	printf("%d", D);
	printf("\n");
	printf("%lf", C);
	printf("\n");
	printf("%s", A);
	T5=B<5;
	while(T5){
		T6=B+2;
		D=T6;
		T7=B<=3;
		if(T7){
			T8=E>4;
			if(T8){
				T9=B>5;
				if(T9){
					T10=D>=3;
					if(T10){
						printf("D maior ou igual a 3");
					}
				}
			}
		}
		printf("%d", D);
		T11=B+1;
		B=T11;
		T10=D>=3;
	}
	printf("\nB=\n");
	printf("%d", D);
}
