describe("User model", () => {
  it("creates a user", async () => {
    const user = await prisma.user.create({
      data: { email: "dick@example.com", password: "pw1234" },
    });

    const found = await prisma.user.findUnique({
      where: { email: "dick@example.com" },
    });

    expect(found).not.toBeNull();
    expect(found.email).toBe("dick@example.com");
  });
});
