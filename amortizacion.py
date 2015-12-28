import math

hipoteca = 100000
capital = hipoteca
interes = 2.0/12
plazo = 360

N = 360
pagadas = 1
sumacuotas = 0
currentMonth = 0
sumaamortizado = 0

amortizaciones_parciales = []

cuota = capital*interes/float((100*(1 - pow((1+interes/100), -plazo) )))

def updateNumberOfPayments(pending, payment):
    N=-1* math.log( 1 - float(pending*interes)/float(payment*100)) / (math.log(1 + interes/100) )
    return N


def amortizado(cuota, interes, mesespagados, numberofpayments):
    value = cuota * (1 - pow(1+interes/100.0, mesespagados-numberofpayments )) / (interes/100.0)
    return value


while N>0:
    a_n_new = amortizado(cuota, interes, pagadas-1, pagadas-1+N)
    a_n = capital - a_n_new
    pagadas += 1
    capital = a_n_new
    if currentMonth!=0 and currentMonth % 3 is 0:
        amount = 0
        prev = N
        capital -= amount
        sumaamortizado += amount
        sumacuotas += amount
        N = updateNumberOfPayments(capital, cuota)
#        print "Number of pending payments: from %d to %d" % (prev, N)
#        print "Number of total payments: %d" % (N + currentMonth)

    sumaamortizado += a_n
    sumacuotas += cuota
    N -= 1
    print "%d) Capital: %d    - cuota: %d      - amort.: %d   %d" % (currentMonth, capital, cuota, a_n, a_n_new)
    currentMonth +=1

print "Cuota: %f" % (cuota)
print "Hipoteca: %d" % (hipoteca)
print "Pagado al banco: %d " % (sumacuotas)
print "Intereses: %d" % (sumacuotas - hipoteca)
print "Suma amortizado: %d" % (sumaamortizado)
