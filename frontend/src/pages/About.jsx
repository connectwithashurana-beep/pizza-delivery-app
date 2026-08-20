export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">About PizzaHub</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        PizzaHub started with one goal: bring restaurant-quality, made-to-order pizza to your doorstep in
        record time. Every pizza is hand-stretched, topped with fresh ingredients, and baked to perfection
        right before it heads out for delivery.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Our custom Pizza Builder lets you choose your base, sauce, cheese, and toppings — so whether you're
        a classic Margherita fan or love loading up on veggies, we've got you covered.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { label: 'Pizzas Delivered', value: '50K+' },
          { label: 'Cities Served', value: '12' },
          { label: 'Happy Customers', value: '20K+' },
          { label: 'Avg Delivery Time', value: '28 min' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-primary-50 p-4 text-center dark:bg-gray-800">
            <div className="text-2xl font-bold text-primary-600">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
