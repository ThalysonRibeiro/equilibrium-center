export interface RanksProps {
  groupedCustomers: GroupedCustomersProps[];
  hours: HoursProps[];
}

interface GroupedCustomersProps {
  name: string;
  email: string;
  phone: string;
  count: number;
}

export interface HoursProps {
  time: string;
  count: number;
}