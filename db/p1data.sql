CREATE TABLE livedata (
  jstime INT,
  consumption INT,
  production INT
);

CREATE TABLE gas (
  jstime INT primary key,
  jaar NUMERIC,
  maand NUMERIC,
  dag NUMERIC,
  weekdag NUMERIC,
  uur NUMERIC,
  stand INT
);

CREATE TABLE elec (
  jstime INT,
  jaar NUMERIC,
  maand NUMERIC,
  dag NUMERIC,
  weekdag NUMERIC,
  uur NUMERIC,
  uselaag INT,
  usehoog INT,
  prodlaag INT,
  prodhoog INT
);

create table lastinsert (
	type varchar(4),
	time INT
);

create table messages (
	jstime,
	p1message VARCHAR(512)
);

create index ltidx ON livedata (jstime);
create index mtidx ON messages (jstime);






