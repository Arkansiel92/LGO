<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use App\State\UserPasswordHasher;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    paginationClientItemsPerPage: true,
    order: ["points" => "DESC"],
    operations: [
        new GetCollection(),
        new Post(processor: UserPasswordHasher::class, validationContext: ['groups' => ['Default', 'user:create']]),
        new Get(),
        new Put(processor: UserPasswordHasher::class),
        new Patch(processor: UserPasswordHasher::class),
        // new Delete(),
    ],
    normalizationContext: ['groups' => ['user:read']],
    // denormalizationContext: ['groups' => ['user:create', 'user:update']],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'clan:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read', 'user:create', 'user:update', 'clan:read'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Groups(['user:create', 'user:update'])]
    private ?string $plainPassword = null;

    #[ORM\Column(length: 255, unique: true)]
    #[ApiFilter(SearchFilter::class, strategy: 'partial')]
    #[Groups(['user:read', 'user:create', 'user:update', 'clan:read'])]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:create'])]
    private ?string $first_name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:create'])]
    private ?string $last_name = null;

    #[ORM\Column(length: 20)]
    #[Groups(['user:read', 'user:create'])]
    private ?string $gender = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[Groups(['user:read', 'user:update'])]
    private ?Title $title = null;

    #[ORM\Column(options: ['default' => 0 ])]
    #[Groups(['user:read', 'user:update', 'clan:read'])]
    private ?int $points = null;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['user:read', 'user:update'])]
    private ?int $win = null;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['user:read', 'user:update'])]
    private ?int $loose = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: HistoricGames::class, orphanRemoval: true)]
    #[Groups(['user:read', 'user:update'])]
    private Collection $historicGames;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: ChallengesUser::class)]
    #[Groups(['user:read', 'user:update'])]
    private Collection $challengesUsers;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    #[Groups(['user:read', 'user:update'])]
    private ?MembersClan $membersClan = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Notification::class)]
    #[Groups(['user:read', 'user:update'])]
    private Collection $notifications;

    public function __construct()
    {
        $this->historicGames = new ArrayCollection();
        $this->points = 0;
        $this->win = 0;
        $this->loose = 0;
        $this->roles = ['ROLE_USER', 'ROLE_BETA'];
        $this->challengesUsers = new ArrayCollection();
        $this->notifications = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(string $first_name): self
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    public function setLastName(string $last_name): self
    {
        $this->last_name = $last_name;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getTitle(): ?Title
    {
        return $this->title;
    }

    public function setTitle(?Title $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getPoints(): ?int
    {
        return $this->points;
    }

    public function setPoints(int $points): self
    {
        $this->points = $points;

        return $this;
    }

    public function getWin(): ?int
    {
        return $this->win;
    }

    public function setWin(int $win): self
    {
        $this->win = $win;

        return $this;
    }

    public function getLoose(): ?int
    {
        return $this->loose;
    }

    public function setLoose(int $loose): self
    {
        $this->loose = $loose;

        return $this;
    }

    /**
     * @return Collection<int, HistoricGames>
     */
    public function getHistoricGames(): Collection
    {
        return $this->historicGames;
    }

    public function addHistoricGame(HistoricGames $historicGame): self
    {
        if (!$this->historicGames->contains($historicGame)) {
            $this->historicGames->add($historicGame);
            $historicGame->setUser($this);
        }

        return $this;
    }

    public function removeHistoricGame(HistoricGames $historicGame): self
    {
        if ($this->historicGames->removeElement($historicGame)) {
            // set the owning side to null (unless already changed)
            if ($historicGame->getUser() === $this) {
                $historicGame->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ChallengesUser>
     */
    public function getChallengesUsers(): Collection
    {
        return $this->challengesUsers;
    }

    public function addChallengesUser(ChallengesUser $challengesUser): self
    {
        if (!$this->challengesUsers->contains($challengesUser)) {
            $this->challengesUsers->add($challengesUser);
            $challengesUser->setUser($this);
        }

        return $this;
    }

    public function removeChallengesUser(ChallengesUser $challengesUser): self
    {
        if ($this->challengesUsers->removeElement($challengesUser)) {
            // set the owning side to null (unless already changed)
            if ($challengesUser->getUser() === $this) {
                $challengesUser->setUser(null);
            }
        }

        return $this;
    }

    public function getMembersClan(): ?MembersClan
    {
        return $this->membersClan;
    }

    public function setMembersClan(MembersClan $membersClan): self
    {
        // set the owning side of the relation if necessary
        if ($membersClan->getUser() !== $this) {
            $membersClan->setUser($this);
        }

        $this->membersClan = $membersClan;

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): self
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): self
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }
}
