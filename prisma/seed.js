import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
	const adminRole = await prisma.role.create({ data: { name: 'Admin' } });
	const basicRole = await prisma.role.create({ data: { name: 'Basic' } });
	const professionalRole = await prisma.role.create({ data: { name: 'Professional' } });

	const salt = await bcrypt.genSalt(10);
	const password = await bcrypt.hash('bc190402684@vu.edu.pk', salt);

	const admin = await prisma.user.create({
		data: {
			email: 'bc190402684@vu.edu.pk',
			password: password,
			roles: {
				create: {
					roleId: adminRole.id,
				},
			},
			meta: {
				create: [
					{
						key: 'first_name',
						value: 'Muhammad Ramiz',
					},
					{
						key: 'last_name',
						value: 'Afzal',
					},
				],
			},
		},
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
