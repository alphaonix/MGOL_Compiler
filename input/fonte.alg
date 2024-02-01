inicio
    varinicio
        literal A,G,K;
        inteiro B,D,E;
        real C;
    varfim;

    escreva "Digite B: ";
    leia B;
    escreva "Digite A: ";
    leia A;
    se(B>2)
    entao
        se(B<=4)
        entao
            escreva "B esta entre 2 e 4";
        fimse
    fimse
    B<-B+1;
    B<-B+2;
    B<-B+3;
    D<-B;
    C<-5.0;
    escreva "\nB=\n";
    escreva D;
    escreva "\n";
    escreva C;
    escreva "\n";
    escreva A;
    repita (B<5)
        D<-B+2;
        se(B<=3)
        entao
            se(E>4)
            entao
                se(B>5)
                entao
                    se(D>=3)
                    entao
                    escreva "D maior ou igual a 3";
                    fimse
                fimse
            fimse
        fimse
        escreva D;
        B<-B+1;
   fimrepita
   escreva "\nB=\n";
   escreva D;
fim
