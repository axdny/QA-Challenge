-- List all your appointments with the doctor’s name, date, time slot, and status, ordered by date descending
select 
	d.id doctor_id, 
	concat(d.first_name, ' ', d.last_name) doctor_name, 
	a.appointment_date, 
	a.time_slot, 
	a.status 
from doctors d
inner join appointments a on d.id = a.doctor_id 
order by a.appointment_date desc

-- List all doctors with the total number of appointments assigned to them in any status. Include doctors with no appointments
select
    d.id doctor_id, 
    concat(d.first_name, ' ', d.last_name) doctor_name, 
    d.specialty, 
    count(a.id) total_appointments
from doctors d
left join appointments a on a.doctor_id = d.id
group by d.id, d.first_name, d.last_name, d.specialty
order by doctor_id;

-- Are there any future appointments assigned to doctors who are currently inactive in the system? Show the detail: doctor name, appointment date, appointment status, and patient name
select
    concat(d.first_name, ' ', d.last_name) doctor_name,
    a.appointment_date,
    a.status appointment_status,
    concat(u.first_name, ' ', u.last_name) patient_name
from appointments a
inner join doctors d on a.doctor_id = d.id
inner join users u on a.patient_id = u.id
where d.is_active = false and a.appointment_date > CURRENT_DATE
order by a.appointment_date asc;

-- Identify any scheduling conflicts: cases where the same doctor has more than one appointment assigned for the same date and time slot. Include the count of appointments per conflict.
select
    d.id doctor_id,
    concat(d.first_name, ' ', d.last_name) doctor_name,
    a.appointment_date,
    a.time_slot,
    count(*) appointment_count
from appointments a
join doctors d on d.id = a.doctor_id
group by d.id, a.appointment_date, a.time_slot
having count(*) > 1
order by doctor_id 

-- Calculate the total revenue collected per doctor (completed payments only), including each doctor’s percentage of the overall total. Order from highest to lowest.
with doctor_revenue as (
    select
        d.id doctor_id,
        concat(d.first_name, ' ', d.last_name) doctor_name,
        sum(p.amount) total_revenue
    from payments p
    inner join appointments a on p.appointment_id = a.id
    inner join doctors d on a.doctor_id = d.id
    where p.status = 'paid'
    group by d.id, d.first_name, d.last_name
)
select
    doctor_id,
    doctor_name,
    total_revenue,
    round(
        total_revenue * 100.0 / sum(total_revenue) over (),
        2
    ) percentage_of_overall_total
from doctor_revenue
order by total_revenue desc;

-- BUGS FOUND
-- The appointment_date column accepts non-existent dates (0123-11-23)​​
-- The time_slot column has text values ​​(bvloanci, Invalid Value) and non-existent numeric values ​​for dates (99:99)

-- NICE TO HAVE
-- Several columns (such as doctor.specialty, payments.status, appointment date.status) should be handled with the id = value combination, taking the data from a separate table, to avoid having made-up data.

