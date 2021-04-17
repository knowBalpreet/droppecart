type CartProduct = {
  productId: number;
  quantity: number;
};

export type Cart = {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
  __v: number;
};

type Address = {
  geolocation: Geolocation;
  city: string;
  street: string;
  number: number;
  zipcode: string;
};

type Geolocation = {
  lat: string;
  long: string;
};

type Name = {
  firstname: string;
  lastname: string;
};

export type User = {
  address: Address;
  id: number;
  email: string;
  username: string;
  password: string;
  name: Name;
  phone: string;
  __v: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export type RootState = {
  carts: Cart[];
  products: Product[];
  users: User[];
};

export type CurrentView = {
  currentView: "users" | "products";
}

export type AccordianProps = {
  carts: Cart[];
  products: Product[];
  users: User[];
  currentView: CurrentView
};

type Label {
  img: any;
  title: string;
  cost: number;
}

type Children {
  img: string;
  title: string;
  quantity: number;
  price: number;
  total: number;
  id: string;
}

export type TransformData {
  label: Label;
  children: Children[];
}

